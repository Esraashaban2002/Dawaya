/**
 * Helper utility to replace generic placeholder drug numbers (e.g. 'دوا 8', 'دواء 8', 'لدواء 8')
 * in product descriptions and names with the correct Arabic word 'الدواء' / 'للدواء'.
 */
export const cleanMedicineText = (text) => {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/لدواء \d+/g, 'للدواء')
    .replace(/لدوا \d+/g, 'للدواء')
    .replace(/دواء \d+/g, 'الدواء')
    .replace(/دوا \d+/g, 'الدواء');
};
