"use client"
export interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
}

export const fetchStudents = (): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Alice", email: "alice@example.com", course: "Math" },
        { id: 2, name: "Bob", email: "bob@example.com", course: "Science" },
      ]);
    }, 1000);
  });
};
