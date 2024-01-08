CREATE SCHEMA IF NOT EXISTS org_{$1};

CREATE TABLE org_{$1}.pricing (
    org_id int4 NOT NULL,
    contract_id varchar NOT NULL DEFAULT ''::character varying,
    product_id int4 NOT NULL,
    product_name varchar NOT NULL DEFAULT ''::character varying,
    plan varchar NOT NULL DEFAULT ''::character varying,
	unit varchar NOT NULL DEFAULT ''::character varying,
    "commit" float8 NOT NULL DEFAULT 0.0, -- GB
	price float8 NOT NULL DEFAULT 0.0,
	exc_price float8 NOT NULL DEFAULT 0.0,
	total_amount float8 NOT NULL DEFAULT 0.0,
	annual_amount float8 NOT NULL DEFAULT 0.0,
    annual_flag bool NOT NULL DEFAULT true,
    "start_date" varchar NOT NULL DEFAULT '230401'::character varying,
    "end_date" varchar NOT NULL DEFAULT '240331'::character varying,
    "start_month" int4 NOT NULL,
    "end_month"int4 NOT NULL,
    total_month_period int4 NOT NULL,  -- ex)12, 24 
	"analley_check" bool NOT NULL DEFAULT true, --true : 딱 사용량까지만 계산/exc_price >0
	reg_date timestamp(0) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text)
);

-- CREATE TABLE org_{$1}.billing (
--     contract_id varchar NOT NULL DEFAULT ''::character varying,
--     partner_key varchar NOT NULL DEFAULT ''::character varying,
--     partner_name varchar NOT NULL DEFAULT ''::character varying,
--     plan varchar NOT NULL DEFAULT ''::character varying,
-- 	unit varchar NOT NULL DEFAULT ''::character varying,
--     "commit" float8 NOT NULL DEFAULT 0.0,
-- 	price float8 NOT NULL DEFAULT 0.0,
-- 	exc_price float8 NOT NULL DEFAULT 0.0,
-- 	"limit" float8 NOT NULL DEFAULT 0.0,
-- 	"control" bool NOT NULL DEFAULT true,
--     "start_date" varchar NOT NULL DEFAULT '230401'::character varying,
--     "end_date" varchar NOT NULL DEFAULT '240331'::character varying,
-- 	reg_date timestamp(0) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text)
-- );


CREATE TABLE org_list(
    org_id bigserial, 
    "partner" varchar NOT NULL DEFAULT ''::character varying,
    switch_key varchar NOT NULL DEFAULT ''::character varying
)


-- org_id 매칭 -> CREATE org_id

-- orgdb => org_1.pricing, org_2.billing, org_3 등등 
-- maindb -> main.org_list , main.product_list(추후 개발- product_id/ org_id_list []int -> 이상품을 누가 쓰고 있는지 조회 가능)

-- 상품이 없으면 insert -> product_id 가져와서 org_id에 insert
-- 상품 리스트도 만들기