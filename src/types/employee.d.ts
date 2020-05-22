interface Employee {
  id: number;
  name: string;
  email: string;
  street: string;
  pin: number;
  apt: string;
  flat_no: number;
  role: string;
  birth_year: number;
  age: number;
}

interface Role {
  role: string;
  salary: number;
}

interface EmployeeRole extends Employee, Role {}
