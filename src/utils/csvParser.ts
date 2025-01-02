import { Customer } from '../types';
import { DateFormat, parseDateString } from './dateFormats';

export interface CSVParseResult {
  success: boolean;
  data?: Omit<Customer, 'id'>[];
  error?: string;
  invalidRows?: Array<{
    line: number;
    content: string;
    reason: string;
  }>;
}

export const parseCSVData = (
  csvText: string, 
  dateFormat: DateFormat
): CSVParseResult => {
  try {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      return {
        success: false,
        error: 'O arquivo CSV deve conter um cabeçalho e pelo menos uma linha de dados'
      };
    }

    const header = lines[0].split(',').map(col => col.trim().toLowerCase());
    const nameIndex = header.findIndex(col => col.includes('name'));
    const entryIndex = header.findIndex(col => col.includes('entry'));
    const exitIndex = header.findIndex(col => col.includes('exit'));
    const segmentIndex = header.findIndex(col => col.includes('segment'));
    const tierIndex = header.findIndex(col => col.includes('tier'));

    if (nameIndex === -1 || entryIndex === -1) {
      return {
        success: false,
        error: 'O CSV deve conter colunas para nome do cliente e data de entrada'
      };
    }

    const invalidRows: Array<{line: number; content: string; reason: string}> = [];
    const validData: Omit<Customer, 'id'>[] = [];

    lines.slice(1).forEach((line, index) => {
      if (!line.trim()) return;

      try {
        const columns = line.split(',').map(col => col.trim());
        const entryDate = parseDateString(columns[entryIndex], dateFormat);
        const exitDateStr = exitIndex !== -1 ? columns[exitIndex] : '';
        const exitDate = exitDateStr ? parseDateString(exitDateStr, dateFormat) : null;
        const segment = segmentIndex !== -1 ? columns[segmentIndex] : undefined;
        const tier = tierIndex !== -1 ? columns[tierIndex] : undefined;

        if (exitDate && exitDate < entryDate) {
          invalidRows.push({
            line: index + 2,
            content: line,
            reason: `Data de saída (${exitDateStr}) é anterior à data de entrada (${columns[entryIndex]})`
          });
          return;
        }

        validData.push({
          name: columns[nameIndex],
          entryDate,
          exitDate,
          segment,
          tier
        });
      } catch (error) {
        invalidRows.push({
          line: index + 2,
          content: line,
          reason: error instanceof Error ? error.message : 'Formato de dados inválido'
        });
      }
    });

    if (invalidRows.length > 0) {
      return {
        success: false,
        error: `Encontradas ${invalidRows.length} linhas inválidas`,
        invalidRows,
        data: validData
      };
    }

    return {
      success: true,
      data: validData
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Falha ao processar dados do CSV'
    };
  }
}