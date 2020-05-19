interface Employee {
  id: number;
  name: string;
  email: string;
  street: string;
  pin: number;
  apt: string;
  flat_no: number;
  role: string;
}

interface Role {
  role: string;
  salary: number;
}

interface EmployeeRole extends Employee, Role {}
