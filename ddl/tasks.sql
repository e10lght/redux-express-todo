-- public.tasks definition
-- Drop table
-- DROP TABLE public.tasks;
CREATE TABLE public.tasks (
    id serial4 NOT NULL,
    task_id varchar(255) NOT NULL,
    title varchar(255) NULL,
    description varchar(255) NOT NULL,
    is_completed bool NOT NULL DEFAULT false,
    due_date timestamptz NOT NULL,
    user_id varchar(255) NOT NULL,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    CONSTRAINT tasks_pkey PRIMARY KEY (id),
    CONSTRAINT tasks_task_id_key UNIQUE (task_id)
);