export const formatDate = (date: any) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2); // ← এখানে পরিবর্তন
  return `${day}/${month}/${year}`;
};