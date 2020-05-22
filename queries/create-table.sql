
-- * Admin Section
create table role (
  role varchar(20),
  salary integer,
  primary key(role)
);

create table employee (
  id integer,
  name varchar(20) not null,
  email varchar(20),
  street varchar(20),
  apt varchar(20),
  flat_no integer,
  role varchar(20),
  birth_year integer,
  age int generated always as (2020 - birth_year) stored,
  primary key (id),
  foreign key (role) references role(role) on delete cascade
);

create table pin (
  street varchar(20),
  pin integer,
  primary key (street)
);

create table phone (
  id integer,
  phone bigint,
  primary key(id, phone),
  foreign key(id) references employee(id) on delete cascade
);

-- * Food Section
create table customer (
  phone bigint,
  name varchar(20),
  street varchar(20),
  apt varchar(20),
  flat_no integer,
  primary key (phone)
);

create table orders (
  id bigint,
  phone bigint,
  primary key(id, phone),
  foreign key(phone) references customer(phone) on delete cascade
);

create table food (
  food_id integer,
  price integer,
  name varchar(50),
  primary key(food_id)
);

create table contains (
  id bigint,
  food_id integer,
  quantity integer,
  primary key(id, food_id),
  foreign key(id) references orders(id) on delete cascade,
  foreign key(food_id) references food(food_id) on delete cascade
);

create table pizza (
  food_id integer,
  size integer,
  foreign key(food_id) references food(food_id) on delete cascade,
  primary key(food_id)
);

create table drink (
  food_id integer,
  quantity integer,
  foreign key(food_id) references food(food_id) on delete cascade,
  primary key(food_id)
);
