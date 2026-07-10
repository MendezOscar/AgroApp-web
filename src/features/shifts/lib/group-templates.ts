import type { TaskTemplate } from '@/shared/types/domain';

export interface TurnoGroup {
  key: string;
  shift: string;
  recurrenceType: string;
  startDate: string;
  endDate: string | null;
  templates: TaskTemplate[];
}

export function groupTemplatesIntoTurnos(templates: TaskTemplate[]): TurnoGroup[] {
  const groups = new Map<string, TurnoGroup>();

  for (const template of templates) {
    const key = `${template.shift}|${template.recurrenceType}|${template.startDate}|${template.endDate ?? ''}`;
    const existing = groups.get(key);
    if (existing) {
      existing.templates.push(template);
    } else {
      groups.set(key, {
        key,
        shift: template.shift,
        recurrenceType: template.recurrenceType,
        startDate: template.startDate,
        endDate: template.endDate ?? null,
        templates: [template],
      });
    }
  }

  return Array.from(groups.values()).sort((a, b) => b.startDate.localeCompare(a.startDate));
}
