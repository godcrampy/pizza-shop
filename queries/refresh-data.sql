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
  id integer auto_increment,
  name varchar(20) not null,
  email varchar(20),
  street varchar(20),
  apt varchar(20),
  flat_no integer,
  role varchar(20),
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

insert into role values("manager", 30000);
insert into role values("waiter", 10000);
insert into role values("cleaner", 10000);
insert into role values("delivery", 12000);
insert into role values("cashier", 15000);

insert into customer values(1234567890, "John Doe", "5th Street", "Skylights", 42);
insert into customer values(80, "Richard Hendricks", "5th Street", "Pied Piper", 5);

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
