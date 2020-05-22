drop database pizza_shop_test;
create database pizza_shop_test;
use pizza_shop_test;


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

insert into role values("admin", 20000);
insert into role values("manager", 30000);
insert into role values("waiter", 10000);
insert into role values("cleaner", 10000);
insert into role values("delivery", 12000);
insert into role values("cashier", 15000);

insert into employee values
(1, "Leonard", "leonard@pizza.com", "theo street", "Hofstader Apartment", 4, "manager", 1995, default);
insert into employee values
(2, "Penny", "penny@pizza.com", "comic street", "Sunset Apartment", 5, "waiter", 1993, default);
insert into employee values
(3, "Sheldon", "sheldor@pizza.com", "theo street", "Hofstader Apartment", 3, "cleaner", 1994, default);
insert into employee values
(4, "Raj", "raj@pizza.com", "MG road", "campfire", 1, "waiter", 1980, default);
insert into employee values
(5, "Howard", "nasa@pizza.com", "MG road", "campfire 2", 2, "delivery", 1992, default);

insert into pin values("theo street", 41345);
insert into pin values("comic street", 41346);
insert into pin values("MG Road", 41345);

insert into phone values(1, 456789123);
insert into phone values(1, 456132789);
insert into phone values(4, 9876543210);


insert into customer values(1234567890, "John Doe", "5th Street", "Skylights", 42);
insert into customer values(80, "Richard Hendricks", "5th Street", "Pied Piper", 5);

insert into orders values(1590037648639, 1234567890);
insert into orders values(1590037648345, 80);

insert into food values(1, 80, "Margherita Pizza: 5 inch");
insert into food values(2, 100, "Margherita Pizza: 7 inch");
insert into food values(3, 120, "Margherita Pizza: 9 inch");
insert into food values(4, 120, "Deep Dish Pizza: 7 inch");
insert into food values(5, 150, "Deep Dish Pizza: 9 inch");
insert into food values(6, 100, "Napoli Pizza: 5 inch");
insert into food values(7, 120, "Napoli Pizza: 7 inch");
insert into food values(8, 150, "Napoli Pizza: 9 inch");

insert into food values(9, 50, "Coke small");
insert into food values(10, 100, "Coke medium");
insert into food values(11, 120, "Coke large");

insert into contains values(1590037648639, 1, 5);
insert into contains values(1590037648639, 9, 3);
insert into contains values(1590037648345, 2, 1);
insert into contains values(1590037648345, 10, 2);

insert into pizza values(1, 5);
insert into pizza values(2, 7);
insert into pizza values(3, 9);
insert into pizza values(4, 7);
insert into pizza values(5, 9);
insert into pizza values(6, 5);
insert into pizza values(7, 7);
insert into pizza values(8, 9);

insert into drink values(9, 100);
insert into drink values(10, 150);
insert into drink values(11, 200);
