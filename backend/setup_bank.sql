-- 1. Enable the pgcrypto extension (required for gen_random_uuid())
create extension if not exists pgcrypto;

--------------------------------------------------
-- 2. Create the User Registration Table (User Profile)
--------------------------------------------------
create table if not exists public.user_accounts (
  user_id             uuid         primary key default gen_random_uuid(),  -- Unique ID for the user
  full_name           varchar(255) not null,      -- Full name
  email               varchar(255) not null unique, -- Email address (unique)
  phone_number        varchar(50)  not null,      -- Phone number
  date_of_birth       date         not null,      -- Date of birth
  residential_address text         not null,      -- Residential address
  account_type        varchar(50)  not null,      -- Account type (e.g., 'personal', 'business')
  username            varchar(50)  not null unique, -- Desired username (unique)
  password_hash       text         not null,      -- Hashed password (do not store plain-text)
  created_at          timestamptz  not null default now()  -- Timestamp for account creation
);

--------------------------------------------------
-- 3. Create the Bank Accounts Table
--------------------------------------------------
create table if not exists public.bank_accounts (
  account_id   uuid         primary key default gen_random_uuid(),  -- Unique bank account ID
  user_id      uuid         not null,                             -- Reference to the owner in user_accounts
  account_type varchar(50)  not null,                             -- e.g., 'checking', 'savings'
  balance      numeric(15,2) not null default 0.00 check (balance >= 0),  -- Balance (cannot be negative)
  created_at   timestamptz  not null default now(),               -- When the account was created
  foreign key (user_id) references public.user_accounts(user_id) on delete cascade
);

--------------------------------------------------
-- 4. Create the Transactions Table
--------------------------------------------------
create table if not exists public.transactions (
  transaction_id        uuid         primary key default gen_random_uuid(),  -- Unique transaction ID
  account_id            uuid         not null,                             -- The account associated with the transaction
  transaction_type      varchar(50)  not null,                             -- e.g., 'deposit', 'withdrawal', 'transfer'
  amount                numeric(15,2) not null check (amount > 0),        -- Transaction amount (must be positive)
  transaction_timestamp timestamptz  not null default now(),               -- Timestamp when the transaction occurred
  description           text,                                                 -- Optional description
  foreign key (account_id) references public.bank_accounts(account_id) on delete cascade
);

--------------------------------------------------
-- 5. Create the Loans Table
--------------------------------------------------
create table if not exists public.loans (
  loan_id       uuid         primary key default gen_random_uuid(),  -- Unique loan ID
  user_id       uuid         not null,                             -- The customer taking the loan
  loan_amount   numeric(15,2) not null check (loan_amount > 0),       -- Total amount of the loan
  interest_rate numeric(5,2)  not null check (interest_rate >= 0),     -- Interest rate (percentage)
  status        varchar(20)  not null check (status in ('pending', 'approved', 'rejected')),  -- Loan status
  created_at    timestamptz  not null default now(),               -- Timestamp when the loan was issued
  foreign key (user_id) references public.user_accounts(user_id) on delete cascade
);

--------------------------------------------------
-- 6. Create the Transfers Table (for Inter-Account Fund Transfers)
--------------------------------------------------
create table if not exists public.transfers (
  transfer_id        uuid         primary key default gen_random_uuid(),  -- Unique transfer ID
  from_account       uuid         not null,                             -- The source account
  to_account         uuid         not null,                             -- The destination account
  amount             numeric(15,2) not null check (amount > 0),        -- Transfer amount
  transfer_timestamp timestamptz  not null default now(),               -- When the transfer occurred
  description        text,                                                 -- Optional description
  foreign key (from_account) references public.bank_accounts(account_id) on delete cascade,
  foreign key (to_account) references public.bank_accounts(account_id) on delete cascade
);

--------------------------------------------------
-- 7. Create the Expenditures Table
--------------------------------------------------
create table if not exists public.expenditures (
  expenditure_id        uuid         primary key default gen_random_uuid(),  -- Unique expenditure ID
  account_id            uuid         not null,                             -- Associated bank account
  category              varchar(50)  not null,                             -- Expenditure category (e.g., 'food', 'bills')
  amount                numeric(15,2) not null check (amount > 0),        -- Expenditure amount
  expenditure_timestamp timestamptz  not null default now(),               -- When the expenditure occurred
  description           text,                                                 -- Optional description or notes
  foreign key (account_id) references public.bank_accounts(account_id) on delete cascade
);

--------------------------------------------------
-- 8. Create Indexes for Improved Performance
--------------------------------------------------
create index if not exists idx_user_accounts_email on public.user_accounts(email);
create index if not exists idx_bank_accounts_user on public.bank_accounts(user_id);
create index if not exists idx_transactions_account on public.transactions(account_id);
create index if not exists idx_loans_user on public.loans(user_id);
create index if not exists idx_transfers_from_account on public.transfers(from_account);
create index if not exists idx_transfers_to_account on public.transfers(to_account);
create index if not exists idx_expenditures_account on public.expenditures(account_id);

--------------------------------------------------
-- 9. Insert Dummy Data into Tables
--------------------------------------------------

-- Insert dummy data into user_accounts
insert into public.user_accounts (user_id, full_name, email, phone_number, date_of_birth, residential_address, account_type, username, password_hash)
values
  ('11111111-1111-1111-1111-111111111111', 'Alice Johnson', 'alice@example.com', '123-456-7890', '1990-01-01', '123 Main St, Cityville', 'personal', 'alicej', '$2b$10$dummyhashvalue1234567890'),
  ('22222222-2222-2222-2222-222222222222', 'Bob Smith', 'bob@example.com', '234-567-8901', '1985-05-05', '456 Elm St, Townsville', 'personal', 'bobsmith', '$2b$10$dummyhashvalue1234567890'),
  ('33333333-3333-3333-3333-333333333333', 'Carol Williams', 'carol@example.com', '345-678-9012', '1978-10-10', '789 Oak St, Villagetown', 'business', 'carolw', '$2b$10$dummyhashvalue1234567890');

-- Insert dummy data into bank_accounts
insert into public.bank_accounts (account_id, user_id, account_type, balance)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'checking', 1000.00),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'savings', 2000.00),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'checking', 3000.00);

-- Insert dummy data into transactions
insert into public.transactions (transaction_id, account_id, transaction_type, amount, description)
values
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'deposit', 500.00, 'Initial deposit'),
  ('dddddddd-dddd-dddd-dddd-ddddddddddde', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'withdrawal', 200.00, 'ATM withdrawal'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddf', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'deposit', 1000.00, 'Salary deposit');

-- Insert dummy data into loans
insert into public.loans (loan_id, user_id, loan_amount, interest_rate, status)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 5000.00, 5.50, 'approved'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeef', '33333333-3333-3333-3333-333333333333', 10000.00, 4.75, 'pending');

-- Insert dummy data into transfers
insert into public.transfers (transfer_id, from_account, to_account, amount, description)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 300.00, 'Payment for services');

-- Insert dummy data into expenditures
insert into public.expenditures (expenditure_id, account_id, category, amount, description)
values
  ('99999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'food', 50.00, 'Dinner at a restaurant'),
  ('88888888-8888-8888-8888-888888888888', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bills', 150.00, 'Monthly utility bill');
