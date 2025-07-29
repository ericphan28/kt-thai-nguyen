--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    auth_uid uuid,
    ho_ten text NOT NULL,
    mssv text,
    email text,
    sdt text,
    sdt_zalo text,
    ten_hien_thi_zalo text,
    link_facebook text,
    ten_hien_thi_facebook text,
    nam_sinh text,
    cong_viec text,
    kinh_nghiem text,
    noi_o text,
    so_thich text[],
    created_at timestamp with time zone DEFAULT now()
);


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.students (id, auth_uid, ho_ten, mssv, email, sdt, sdt_zalo, ten_hien_thi_zalo, link_facebook, ten_hien_thi_facebook, nam_sinh, cong_viec, kinh_nghiem, noi_o, so_thich, created_at) FROM stdin;
\.


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: students_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_email_idx ON public.students USING btree (email);


--
-- Name: students_sdt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_sdt_idx ON public.students USING btree (sdt);


--
-- Name: students students_auth_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_auth_uid_fkey FOREIGN KEY (auth_uid) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

