

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE SCHEMA IF NOT EXISTS "drizzle";


ALTER SCHEMA "drizzle" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE SCHEMA IF NOT EXISTS "next_auth";


ALTER SCHEMA "next_auth" OWNER TO "postgres";


CREATE SCHEMA IF NOT EXISTS "notion";


ALTER SCHEMA "notion" OWNER TO "postgres";


CREATE SCHEMA IF NOT EXISTS "private";


ALTER SCHEMA "private" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE SCHEMA IF NOT EXISTS "vecs";


ALTER SCHEMA "vecs" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "btree_gin" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "ltree" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgmq";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";






CREATE TYPE "public"."billing_period_status" AS ENUM (
    'open',
    'closed',
    'approved'
);


ALTER TYPE "public"."billing_period_status" OWNER TO "postgres";


CREATE TYPE "public"."budget_status" AS ENUM (
    'locked',
    'unlocked'
);


ALTER TYPE "public"."budget_status" OWNER TO "postgres";


CREATE TYPE "public"."calculation_method" AS ENUM (
    'unit_price',
    'lump_sum',
    'percentage'
);


ALTER TYPE "public"."calculation_method" OWNER TO "postgres";


CREATE TYPE "public"."change_event_status" AS ENUM (
    'open',
    'closed'
);


ALTER TYPE "public"."change_event_status" OWNER TO "postgres";


CREATE TYPE "public"."change_order_status" AS ENUM (
    'draft',
    'pending',
    'approved',
    'void'
);


ALTER TYPE "public"."change_order_status" OWNER TO "postgres";


CREATE TYPE "public"."commitment_type" AS ENUM (
    'subcontract',
    'purchase_order',
    'service_order'
);


ALTER TYPE "public"."commitment_type" OWNER TO "postgres";


CREATE TYPE "public"."company_type" AS ENUM (
    'vendor',
    'subcontractor',
    'owner',
    'architect',
    'other'
);


ALTER TYPE "public"."company_type" OWNER TO "postgres";


CREATE TYPE "public"."contract_status" AS ENUM (
    'draft',
    'pending',
    'executed',
    'closed',
    'terminated'
);


ALTER TYPE "public"."contract_status" OWNER TO "postgres";


CREATE TYPE "public"."contract_type" AS ENUM (
    'prime_contract',
    'commitment'
);


ALTER TYPE "public"."contract_type" OWNER TO "postgres";


CREATE TYPE "public"."erp_sync_status" AS ENUM (
    'pending',
    'synced',
    'failed',
    'resyncing'
);


ALTER TYPE "public"."erp_sync_status" OWNER TO "postgres";


CREATE TYPE "public"."invoice_status" AS ENUM (
    'draft',
    'pending',
    'approved',
    'paid',
    'void'
);


ALTER TYPE "public"."invoice_status" OWNER TO "postgres";


CREATE TYPE "public"."issue_category" AS ENUM (
    'Design',
    'Submittal',
    'Scheduling',
    'Procurement',
    'Installation',
    'Safety',
    'Change Order',
    'Other'
);


ALTER TYPE "public"."issue_category" OWNER TO "postgres";


CREATE TYPE "public"."issue_severity" AS ENUM (
    'Low',
    'Medium',
    'High',
    'Critical'
);


ALTER TYPE "public"."issue_severity" OWNER TO "postgres";


CREATE TYPE "public"."issue_status" AS ENUM (
    'Open',
    'In Progress',
    'Resolved',
    'Pending Verification'
);


ALTER TYPE "public"."issue_status" OWNER TO "postgres";


CREATE TYPE "public"."project_status" AS ENUM (
    'active',
    'inactive',
    'complete'
);


ALTER TYPE "public"."project_status" OWNER TO "postgres";


CREATE TYPE "public"."task_status" AS ENUM (
    'todo',
    'doing',
    'review',
    'done'
);


ALTER TYPE "public"."task_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "next_auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select
    coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;


ALTER FUNCTION "next_auth"."uid"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "private"."enqueue_document_for_insights"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  -- Only act when the status changed to 'generate_insights'
  if (tg_op = 'UPDATE') then
    if (new.processing_status = 'generate_insights'
        and (old.processing_status is distinct from new.processing_status)) then

      -- Insert a queue row, avoiding duplicates for the same document in pending state
      insert into private.document_processing_queue(document_id, status, created_at, updated_at)
      select new.id, 'pending', now(), now()
      where not exists (
        select 1 from private.document_processing_queue q
        where q.document_id = new.id and q.status = 'pending'
      );

      -- Emit a lightweight notify with the document id for listeners
      perform pg_notify('documents_generate_insights', new.id::text);
    end if;
  end if;
  return new;
end;
$$;


ALTER FUNCTION "private"."enqueue_document_for_insights"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "private"."uuid_or_null"("str" "text") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
begin
  return str::uuid;
  exception when invalid_text_representation then
    return null;
  end;
$$;


ALTER FUNCTION "private"."uuid_or_null"("str" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."_ai_insights_counts_trigger_fn"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.documents SET ai_insights_count = ai_insights_count + 1 WHERE id = NEW.document_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.documents SET ai_insights_count = GREATEST(ai_insights_count - 1, 0) WHERE id = OLD.document_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.document_id IS DISTINCT FROM OLD.document_id THEN
      UPDATE public.documents SET ai_insights_count = GREATEST(ai_insights_count - 1, 0) WHERE id = OLD.document_id;
      UPDATE public.documents SET ai_insights_count = ai_insights_count + 1 WHERE id = NEW.document_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."_ai_insights_counts_trigger_fn"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_meeting_participants_to_contacts"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    participant TEXT;
    first_name TEXT;
    last_name TEXT;
    processed_emails TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Exit early if no participants
    IF NEW.participants IS NULL OR array_length(NEW.participants, 1) = 0 THEN
        RETURN NEW;
    END IF;

    -- Iterate through each participant
    FOREACH participant IN ARRAY NEW.participants
    LOOP
        -- Skip if email already processed
        IF participant = ANY(processed_emails) THEN
            CONTINUE;
        END IF;

        -- Extract first and last names from email
        SELECT ex.first_name, ex.last_name 
        INTO first_name, last_name 
        FROM email_to_names(participant) ex;

        -- Insert contact if not exists, ignoring duplicates
        INSERT INTO contacts (first_name, last_name, email)
        VALUES (first_name, last_name, participant)
        ON CONFLICT (email) DO NOTHING;

        -- Track processed emails
        processed_emails := array_append(processed_emails, participant);
    END LOOP;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."add_meeting_participants_to_contacts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."ai_insights_exact_quotes_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN NEW.exact_quotes_text := public.normalize_exact_quotes(NEW.exact_quotes::jsonb); RETURN NEW; END; $$;


ALTER FUNCTION "public"."ai_insights_exact_quotes_trigger"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."archive_task"("task_id_param" "uuid", "archived_by_param" "text" DEFAULT 'system'::"text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    task_exists BOOLEAN;
BEGIN
    -- Check if task exists and is not already archived
    SELECT EXISTS(
        SELECT 1 FROM archon_tasks
        WHERE id = task_id_param AND archived = FALSE
    ) INTO task_exists;

    IF NOT task_exists THEN
        RETURN FALSE;
    END IF;

    -- Archive the task
    UPDATE archon_tasks
    SET
        archived = TRUE,
        archived_at = NOW(),
        archived_by = archived_by_param,
        updated_at = NOW()
    WHERE id = task_id_param;

    -- Also archive all subtasks
    UPDATE archon_tasks
    SET
        archived = TRUE,
        archived_at = NOW(),
        archived_by = archived_by_param,
        updated_at = NOW()
    WHERE parent_task_id = task_id_param AND archived = FALSE;

    RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."archive_task"("task_id_param" "uuid", "archived_by_param" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."assign_meeting_project_id"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Check for different keywords in the title and assign appropriate project_id
  IF NEW.title ILIKE '%Niemann%' THEN
    NEW.project_id := 38;
  ELSIF NEW.title ILIKE '%Uniqlo%' THEN
    NEW.project_id := 31;
  ELSIF NEW.title ILIKE '%Goodwill Bloomington%' THEN
    NEW.project_id := 47;
  ELSIF NEW.title ILIKE '%Westfield%' THEN
    NEW.project_id := 43;
  -- Add more conditions as needed
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."assign_meeting_project_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auto_archive_old_chats"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    UPDATE chats
    SET is_archived = TRUE
    WHERE NOT is_archived
    AND last_message_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS archived_count = ROW_COUNT;
    RETURN archived_count;
END;
$$;


ALTER FUNCTION "public"."auto_archive_old_chats"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."backfill_meeting_participants_to_contacts"() RETURNS TABLE("total_contacts_added" integer, "unique_emails" "text"[])
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    participant TEXT;
    first_name TEXT;
    last_name TEXT;
    processed_emails TEXT[] := ARRAY[]::TEXT[];
    total_added INTEGER := 0;
    meeting_rec RECORD;
BEGIN
    -- Loop through all existing meetings with participants
    FOR meeting_rec IN 
        SELECT id, participants 
        FROM meetings 
        WHERE participants IS NOT NULL AND array_length(participants, 1) > 0
    LOOP
        -- Iterate through each participant in the meeting
        FOREACH participant IN ARRAY meeting_rec.participants
        LOOP
            -- Skip if email already processed
            IF participant = ANY(processed_emails) THEN
                CONTINUE;
            END IF;

            -- Extract first and last names from email
            SELECT ex.first_name, ex.last_name 
            INTO first_name, last_name 
            FROM email_to_names(participant) ex;

            -- Insert contact if not exists, ignoring duplicates
            INSERT INTO contacts (first_name, last_name, email)
            VALUES (first_name, last_name, participant)
            ON CONFLICT (email) DO NOTHING;

            -- Track processed emails and increment counter
            processed_emails := array_append(processed_emails, participant);
            total_added := total_added + 1;
        END LOOP;
    END LOOP;

    RETURN QUERY SELECT total_added, processed_emails;
END;
$$;


ALTER FUNCTION "public"."backfill_meeting_participants_to_contacts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."batch_update_project_assignments"("p_assignments" "jsonb") RETURNS TABLE("document_id" "text", "success" boolean, "error_message" "text")
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  assignment JSONB;
  doc_id TEXT;
  proj_id BIGINT;
  confidence_val NUMERIC;
  reasoning_val TEXT;
  update_success BOOLEAN;
BEGIN
  -- Process each assignment
  FOR assignment IN SELECT jsonb_array_elements(p_assignments)
  LOOP
    BEGIN
      -- Extract values from JSON
      doc_id := (assignment->>'document_id')::TEXT;
      proj_id := (assignment->>'project_id')::BIGINT;
      confidence_val := (assignment->>'confidence')::NUMERIC;
      reasoning_val := assignment->>'reasoning';
      
      -- Attempt the update
      SELECT update_document_project_assignment(
        doc_id, 
        proj_id, 
        confidence_val, 
        reasoning_val
      ) INTO update_success;
      
      RETURN QUERY SELECT doc_id, update_success, NULL::TEXT;
      
    EXCEPTION WHEN OTHERS THEN
      RETURN QUERY SELECT doc_id, FALSE, SQLERRM;
    END;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."batch_update_project_assignments"("p_assignments" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."compare_budget_snapshots"("p_snapshot_id_1" "uuid", "p_snapshot_id_2" "uuid") RETURNS TABLE("budget_code_id" "uuid", "cost_code_id" "text", "cost_code_description" "text", "original_budget_1" numeric, "revised_budget_1" numeric, "projected_costs_1" numeric, "projected_over_under_1" numeric, "original_budget_2" numeric, "revised_budget_2" numeric, "projected_costs_2" numeric, "projected_over_under_2" numeric, "delta_original_budget" numeric, "delta_revised_budget" numeric, "delta_projected_costs" numeric, "delta_projected_over_under" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    WITH
    snapshot1_items AS (
        SELECT
            (item->>'budget_code_id')::UUID as budget_code_id,
            item->>'cost_code_id' as cost_code_id,
            item->>'cost_code_description' as cost_code_description,
            (item->>'original_budget_amount')::NUMERIC(15,2) as original_budget,
            (item->>'revised_budget')::NUMERIC(15,2) as revised_budget,
            (item->>'projected_costs')::NUMERIC(15,2) as projected_costs,
            (item->>'projected_over_under')::NUMERIC(15,2) as projected_over_under
        FROM budget_snapshots bs,
             jsonb_array_elements(bs.line_items) as item
        WHERE bs.id = p_snapshot_id_1
    ),
    snapshot2_items AS (
        SELECT
            (item->>'budget_code_id')::UUID as budget_code_id,
            item->>'cost_code_id' as cost_code_id,
            item->>'cost_code_description' as cost_code_description,
            (item->>'original_budget_amount')::NUMERIC(15,2) as original_budget,
            (item->>'revised_budget')::NUMERIC(15,2) as revised_budget,
            (item->>'projected_costs')::NUMERIC(15,2) as projected_costs,
            (item->>'projected_over_under')::NUMERIC(15,2) as projected_over_under
        FROM budget_snapshots bs,
             jsonb_array_elements(bs.line_items) as item
        WHERE bs.id = p_snapshot_id_2
    )
    SELECT
        COALESCE(s1.budget_code_id, s2.budget_code_id) as budget_code_id,
        COALESCE(s1.cost_code_id, s2.cost_code_id) as cost_code_id,
        COALESCE(s1.cost_code_description, s2.cost_code_description) as cost_code_description,

        COALESCE(s1.original_budget, 0) as original_budget_1,
        COALESCE(s1.revised_budget, 0) as revised_budget_1,
        COALESCE(s1.projected_costs, 0) as projected_costs_1,
        COALESCE(s1.projected_over_under, 0) as projected_over_under_1,

        COALESCE(s2.original_budget, 0) as original_budget_2,
        COALESCE(s2.revised_budget, 0) as revised_budget_2,
        COALESCE(s2.projected_costs, 0) as projected_costs_2,
        COALESCE(s2.projected_over_under, 0) as projected_over_under_2,

        COALESCE(s2.original_budget, 0) - COALESCE(s1.original_budget, 0) as delta_original_budget,
        COALESCE(s2.revised_budget, 0) - COALESCE(s1.revised_budget, 0) as delta_revised_budget,
        COALESCE(s2.projected_costs, 0) - COALESCE(s1.projected_costs, 0) as delta_projected_costs,
        COALESCE(s2.projected_over_under, 0) - COALESCE(s1.projected_over_under, 0) as delta_projected_over_under
    FROM snapshot1_items s1
    FULL OUTER JOIN snapshot2_items s2 ON s1.budget_code_id = s2.budget_code_id;
END;
$$;


ALTER FUNCTION "public"."compare_budget_snapshots"("p_snapshot_id_1" "uuid", "p_snapshot_id_2" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."convert_embeddings_to_vector"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN SELECT id, embedding FROM meeting_embeddings WHERE embedding_vector IS NULL
    LOOP
        -- This assumes embeddings are stored as JSON arrays in string format
        -- Adjust based on your actual format
        BEGIN
            UPDATE meeting_embeddings 
            SET embedding_vector = embedding::vector(1536)
            WHERE id = rec.id;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to convert embedding for id %: %', rec.id, SQLERRM;
        END;
    END LOOP;
END;
$$;


ALTER FUNCTION "public"."convert_embeddings_to_vector"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_budget_snapshot"("p_project_id" bigint, "p_snapshot_name" character varying, "p_snapshot_type" character varying DEFAULT 'manual'::character varying, "p_description" "text" DEFAULT NULL::"text", "p_is_baseline" boolean DEFAULT false) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_snapshot_id UUID;
    v_line_items JSONB;
    v_grand_totals JSONB;
    v_project_metadata JSONB;
    v_user_id UUID;
BEGIN
    -- Get current user
    v_user_id := auth.uid();

    -- Refresh materialized view first to ensure accuracy
    PERFORM refresh_budget_rollup(p_project_id);

    -- Get line items from view
    SELECT jsonb_agg(row_to_json(br)::jsonb)
    INTO v_line_items
    FROM v_budget_rollup br
    WHERE br.project_id = p_project_id;

    -- Get grand totals from view
    SELECT row_to_json(gt)::jsonb
    INTO v_grand_totals
    FROM v_budget_grand_totals gt
    WHERE gt.project_id = p_project_id;

    -- Get project metadata
    SELECT jsonb_build_object(
        'name', p.name,
        'code', p.code,
        'status', p.status,
        'start_date', p.start_date,
        'end_date', p.end_date
    )
    INTO v_project_metadata
    FROM projects p
    WHERE p.id = p_project_id;

    -- Insert snapshot
    INSERT INTO budget_snapshots (
        project_id,
        snapshot_name,
        snapshot_type,
        description,
        line_items,
        grand_totals,
        project_metadata,
        is_baseline,
        created_by
    ) VALUES (
        p_project_id,
        p_snapshot_name,
        p_snapshot_type,
        p_description,
        v_line_items,
        v_grand_totals,
        v_project_metadata,
        p_is_baseline,
        v_user_id
    )
    RETURNING id INTO v_snapshot_id;

    RETURN v_snapshot_id;
END;
$$;


ALTER FUNCTION "public"."create_budget_snapshot"("p_project_id" bigint, "p_snapshot_name" character varying, "p_snapshot_type" character varying, "p_description" "text", "p_is_baseline" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_conversation_with_message"("p_title" "text", "p_agent_type" "text", "p_role" "text", "p_content" "text", "p_metadata" "jsonb" DEFAULT '{}'::"jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_conversation_id UUID;
  v_user_id UUID;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  -- Create the conversation
  INSERT INTO conversations (title, agent_type, user_id, metadata)
  VALUES (p_title, p_agent_type, v_user_id, p_metadata)
  RETURNING id INTO v_conversation_id;
  
  -- Add the initial message
  INSERT INTO conversation_history (conversation_id, role, content, user_id, metadata)
  VALUES (v_conversation_id, p_role, p_content, v_user_id, p_metadata);
  
  RETURN v_conversation_id;
END;
$$;


ALTER FUNCTION "public"."create_conversation_with_message"("p_title" "text", "p_agent_type" "text", "p_role" "text", "p_content" "text", "p_metadata" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."document_metadata_set_category"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- default to leaving category NULL
    NEW.category := NULL;

    IF NEW.title IS NOT NULL THEN
      -- case-insensitive checks
      IF NEW.title ILIKE '%executive weekly meeting%' THEN
        NEW.category := 'Weekly Exec';
      ELSIF NEW.title ILIKE '%weekly ops%' THEN
        NEW.category := 'Weekly Ops';
      ELSIF NEW.title ILIKE '%weekly update%' THEN
        NEW.category := 'Ops Update';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."document_metadata_set_category"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."email_to_names"("email" "text") RETURNS TABLE("first_name" "text", "last_name" "text")
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    username TEXT;
    name_parts TEXT[];
BEGIN
    -- Extract username part of email (before @)
    username := split_part(email, '@', 1);
    
    -- Special handling for common email formats
    name_parts := 
        CASE 
            WHEN username ~ '^[a-z][a-z]+[0-9]*$' THEN 
                ARRAY[username]
            WHEN username ~ '^[a-z][\._-][a-z]+$' THEN 
                regexp_split_to_array(username, '[._-]')
            ELSE 
                ARRAY[username]
        END;
    
    -- Handling different name parsing scenarios
    RETURN QUERY 
    SELECT 
        CASE 
            WHEN array_length(name_parts, 1) = 1 THEN initcap(name_parts[1])
            ELSE initcap(name_parts[1]) 
        END AS first_name,
        CASE 
            WHEN array_length(name_parts, 1) > 1 THEN initcap(name_parts[array_length(name_parts, 1)])
            ELSE NULL 
        END AS last_name;
END;
$_$;


ALTER FUNCTION "public"."email_to_names"("email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enhanced_match_chunks"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "project_filter" integer DEFAULT NULL::integer, "date_after" timestamp without time zone DEFAULT NULL::timestamp without time zone, "doc_type_filter" "text" DEFAULT NULL::"text") RETURNS TABLE("chunk_id" "uuid", "document_id" "uuid", "content" "text", "similarity" double precision, "metadata" "jsonb", "document_title" "text", "document_source" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id AS chunk_id,
        c.document_id,
        c.content,
        1 - (c.embedding <=> query_embedding) AS similarity,
        c.metadata,
        d.title AS document_title,
        d.source AS document_source,
        d.created_at
    FROM chunks c
    JOIN documents d ON c.document_id = d.id
    WHERE c.embedding IS NOT NULL
        AND (project_filter IS NULL OR d.project_id = project_filter)
        AND (date_after IS NULL OR d.created_at >= date_after)
        AND (doc_type_filter IS NULL OR d.document_type = doc_type_filter)
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."enhanced_match_chunks"("query_embedding" "public"."vector", "match_count" integer, "project_filter" integer, "date_after" timestamp without time zone, "doc_type_filter" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."execute_custom_sql"("sql_query" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  result JSONB;
BEGIN
  -- Execute the SQL and capture the result
  EXECUTE 'SELECT jsonb_agg(t) FROM (' || sql_query || ') t' INTO result;
  RETURN COALESCE(result, '[]'::jsonb);
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', SQLERRM,
      'detail', SQLSTATE
    );
END;
$$;


ALTER FUNCTION "public"."execute_custom_sql"("sql_query" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."extract_names"("participant" "text") RETURNS TABLE("first_name" "text", "last_name" "text")
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    name_parts TEXT[];
BEGIN
    -- Split the participant name into parts
    name_parts := string_to_array(participant, ' ');
    
    -- If only one name is provided, use it as first name
    IF array_length(name_parts, 1) = 1 THEN
        RETURN QUERY SELECT participant, NULL::TEXT;
    -- If two names, first is first name, second is last name
    ELSIF array_length(name_parts, 1) = 2 THEN
        RETURN QUERY SELECT name_parts[1], name_parts[2];
    -- If more than two names, first is first name, last is last name
    ELSE
        RETURN QUERY SELECT name_parts[1], name_parts[array_length(name_parts, 1)];
    END IF;
END;
$$;


ALTER FUNCTION "public"."extract_names"("participant" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."find_duplicate_insights"("p_similarity_threshold" numeric DEFAULT 0.8) RETURNS TABLE("insight1_id" bigint, "insight2_id" bigint, "title1" "text", "title2" "text", "similarity_score" numeric, "same_project" boolean, "same_document" boolean)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  WITH insight_pairs AS (
    SELECT 
      ai1.id as id1,
      ai2.id as id2,
      ai1.title as title1,
      ai2.title as title2,
      ai1.project_id as project1,
      ai2.project_id as project2,
      ai1.document_id as doc1,
      ai2.document_id as doc2,
      -- Simple similarity based on title and description overlap
      (
        (CASE WHEN ai1.title = ai2.title THEN 0.5 ELSE 0 END) +
        (CASE WHEN ai1.description = ai2.description THEN 0.4 ELSE 0 END) +
        (CASE WHEN ai1.insight_type = ai2.insight_type THEN 0.1 ELSE 0 END)
      ) as similarity
    FROM ai_insights ai1
    CROSS JOIN ai_insights ai2
    WHERE ai1.id < ai2.id  -- Avoid duplicate pairs
      AND ai1.created_at >= NOW() - INTERVAL '30 days'
      AND ai2.created_at >= NOW() - INTERVAL '30 days'
  )
  SELECT 
    ip.id1,
    ip.id2,
    ip.title1,
    ip.title2,
    ip.similarity,
    (ip.project1 = ip.project2),
    (ip.doc1 = ip.doc2)
  FROM insight_pairs ip
  WHERE ip.similarity >= p_similarity_threshold
  ORDER BY ip.similarity DESC, ip.id1, ip.id2;
END;
$$;


ALTER FUNCTION "public"."find_duplicate_insights"("p_similarity_threshold" numeric) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."find_sprinkler_requirements"("p_asrs_type" "text" DEFAULT NULL::"text", "p_system_type" "text" DEFAULT NULL::"text", "p_ceiling_height_ft" numeric DEFAULT NULL::numeric, "p_commodity_class" "text" DEFAULT NULL::"text", "p_tolerance_ft" numeric DEFAULT 5) RETURNS TABLE("table_id" "text", "table_number" integer, "title" "text", "sprinkler_count" integer, "k_factor" numeric, "pressure_psi" numeric, "special_conditions" "text"[], "height_match_type" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    fmt.table_id,
    fmt.table_number,
    fmt.title,
    fsc.sprinkler_count,
    fsc.k_factor,
    fsc.pressure_psi,
    fsc.special_conditions,
    CASE 
      WHEN ABS(fsc.ceiling_height_ft - p_ceiling_height_ft) <= p_tolerance_ft THEN 'exact'
      ELSE 'interpolated'
    END as height_match_type
  FROM fm_global_tables fmt
  JOIN fm_sprinkler_configs fsc ON fmt.table_id = fsc.table_id
  WHERE 
    (p_asrs_type IS NULL OR fmt.asrs_type = p_asrs_type)
    AND (p_system_type IS NULL OR fmt.system_type = p_system_type OR fmt.system_type = 'both')
    AND (p_ceiling_height_ft IS NULL OR 
         (fsc.ceiling_height_ft BETWEEN p_ceiling_height_ft - p_tolerance_ft 
                                   AND p_ceiling_height_ft + p_tolerance_ft))
    AND (p_commodity_class IS NULL OR p_commodity_class = ANY(fmt.commodity_types))
  ORDER BY 
    ABS(fsc.ceiling_height_ft - COALESCE(p_ceiling_height_ft, fsc.ceiling_height_ft)),
    fmt.table_number;
END;
$$;


ALTER FUNCTION "public"."find_sprinkler_requirements"("p_asrs_type" "text", "p_system_type" "text", "p_ceiling_height_ft" numeric, "p_commodity_class" "text", "p_tolerance_ft" numeric) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."find_sprinkler_requirements"("p_asrs_type" character varying DEFAULT NULL::character varying, "p_system_type" character varying DEFAULT NULL::character varying, "p_ceiling_height_ft" integer DEFAULT NULL::integer, "p_commodity_class" character varying DEFAULT NULL::character varying, "p_k_factor" numeric DEFAULT NULL::numeric) RETURNS TABLE("table_id" character varying, "table_number" integer, "title" "text", "ceiling_height_ft" integer, "k_factor" numeric, "k_type" character varying, "sprinkler_count" integer, "pressure_psi" numeric, "pressure_bar" numeric, "sprinkler_orientation" character varying, "sprinkler_response" character varying, "special_conditions" "text"[])
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_id,
        t.table_number,
        t.title,
        t.ceiling_height_ft,
        t.k_factor,
        t.k_type,
        t.sprinkler_count,
        t.pressure_psi,
        t.pressure_bar,
        t.sprinkler_orientation,
        t.sprinkler_response,
        t.special_conditions
    FROM fm_global_tables t
    WHERE 
        (p_asrs_type IS NULL OR t.asrs_type = p_asrs_type)
        AND (p_system_type IS NULL OR t.system_type = p_system_type)
        AND (p_ceiling_height_ft IS NULL OR t.ceiling_height_ft = p_ceiling_height_ft)
        AND (p_commodity_class IS NULL OR p_commodity_class = ANY(t.commodity_classes))
        AND (p_k_factor IS NULL OR t.k_factor = p_k_factor)
        AND t.sprinkler_count IS NOT NULL
    ORDER BY t.table_number, t.ceiling_height_ft, t.k_factor;
END;
$$;


ALTER FUNCTION "public"."find_sprinkler_requirements"("p_asrs_type" character varying, "p_system_type" character varying, "p_ceiling_height_ft" integer, "p_commodity_class" character varying, "p_k_factor" numeric) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."find_sprinkler_requirements"("p_asrs_type" character varying, "p_system_type" character varying, "p_ceiling_height_ft" integer, "p_commodity_class" character varying, "p_k_factor" numeric) IS 'Search for sprinkler requirements with optional filters';



CREATE OR REPLACE FUNCTION "public"."fn_log_projects_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_changed_cols text[];
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_changed_cols = array(SELECT jsonb_object_keys(to_jsonb(NEW))::text);
    INSERT INTO public.projects_audit(project_id, operation, changed_by, changed_at, changed_columns, old_data, new_data, metadata)
    VALUES (NEW.id, 'INSERT', NULL, now(), v_changed_cols, NULL, to_jsonb(NEW), jsonb_build_object('tg_table', TG_TABLE_NAME));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- determine changed columns by comparing OLD and NEW
    SELECT array_agg(key) INTO v_changed_cols
    FROM (
      SELECT key
      FROM jsonb_each_text(to_jsonb(NEW))
      WHERE (to_jsonb(OLD) ->> key) IS DISTINCT FROM (to_jsonb(NEW) ->> key)
      ) s(key);

    INSERT INTO public.projects_audit(project_id, operation, changed_by, changed_at, changed_columns, old_data, new_data, metadata)
    VALUES (COALESCE(NEW.id, OLD.id), 'UPDATE', NULL, now(), v_changed_cols, to_jsonb(OLD), to_jsonb(NEW), jsonb_build_object('tg_table', TG_TABLE_NAME));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    v_changed_cols = array(SELECT jsonb_object_keys(to_jsonb(OLD))::text);
    INSERT INTO public.projects_audit(project_id, operation, changed_by, changed_at, changed_columns, old_data, new_data, metadata)
    VALUES (OLD.id, 'DELETE', NULL, now(), v_changed_cols, to_jsonb(OLD), NULL, jsonb_build_object('tg_table', TG_TABLE_NAME));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."fn_log_projects_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_propagate_division_title_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_old text;
  v_new text;
  v_updated int;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    v_old := OLD.title;
    v_new := NEW.title;
    IF v_old IS DISTINCT FROM v_new THEN
      UPDATE public.cost_codes
      SET division_title = v_new
      WHERE division_id = NEW.id;

      GET DIAGNOSTICS v_updated = ROW_COUNT;

      INSERT INTO public.cost_code_division_updates_audit(division_id, old_title, new_title, updated_count)
      VALUES (NEW.id, v_old, v_new, v_updated);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."fn_propagate_division_title_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_sync_cost_code_division_title"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_title text;
BEGIN
  -- If no division_id, clear the division_title
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.division_id IS NULL THEN
      NEW.division_title := NULL;
      RETURN NEW;
    END IF;

    SELECT title INTO v_title FROM public.cost_code_divisions WHERE id = NEW.division_id;
    NEW.division_title := v_title;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."fn_sync_cost_code_division_title"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."full_text_search_meetings"("search_query" "text", "match_count" integer DEFAULT 5) RETURNS TABLE("id" "text", "title" "text", "content" "text", "participants" "text", "date" timestamp without time zone, "category" "text", "rank" real)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.id,
    dm.title,
    dm.content,
    dm.participants,
    dm.date,
    dm.category,
    ts_rank(to_tsvector('english', COALESCE(dm.content, '') || ' ' || COALESCE(dm.title, '')), 
            plainto_tsquery('english', search_query)) as rank
  FROM document_metadata dm
  WHERE type = 'meeting_transcript'
    AND (to_tsvector('english', COALESCE(dm.content, '') || ' ' || COALESCE(dm.title, '')) 
         @@ plainto_tsquery('english', search_query))
  ORDER BY rank DESC
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."full_text_search_meetings"("search_query" "text", "match_count" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."full_text_search_meetings"("search_query" "text", "match_count" integer) IS 'Full-text search across meeting content and titles';



CREATE OR REPLACE FUNCTION "public"."generate_optimization_recommendations"("project_data" "jsonb") RETURNS TABLE("recommendation" "text", "savings_potential" numeric, "priority" character varying, "implementation_effort" character varying, "technical_details" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    storage_height DECIMAL;
    container_type TEXT;
    asrs_type TEXT;
    system_type TEXT;
    rack_row_depth DECIMAL;
    commodity_class TEXT;
BEGIN
    -- Extract key parameters from project_data
    storage_height := COALESCE((project_data->>'storage_height_ft')::DECIMAL, 0);
    container_type := project_data->>'container_type';
    asrs_type := project_data->>'asrs_type';
    system_type := project_data->>'system_type';
    rack_row_depth := COALESCE((project_data->>'rack_row_depth_ft')::DECIMAL, 0);
    commodity_class := project_data->>'commodity_class';
    
    -- Rule 1: Critical Height Threshold (20 ft)
    IF storage_height > 20 THEN
        RETURN QUERY SELECT 
            'CRITICAL: Reduce storage height to ≤20 ft to avoid enhanced protection requirements. This eliminates need for higher pressure sprinklers and additional in-rack protection.'::TEXT,
            125000.00::DECIMAL,
            'Critical'::VARCHAR,
            'Moderate'::VARCHAR,
            jsonb_build_object(
                'current_height', storage_height,
                'recommended_height', 20,
                'protection_reduction', 'Enhanced ceiling protection avoided',
                'table_reference', 'Multiple tables have 20ft thresholds'
            );
    END IF;
    
    -- Rule 2: Container Type Optimization (Biggest Impact)
    IF container_type = 'open_top_combustible' AND asrs_type = 'mini-load' THEN
        RETURN QUERY SELECT
            'MAJOR SAVINGS: Switch to closed-top containers to eliminate all in-rack sprinkler requirements. This is typically the highest impact change.'::TEXT,
            200000.00::DECIMAL,
            'Critical'::VARCHAR,
            'Minimal'::VARCHAR,
            jsonb_build_object(
                'current_protection', 'Ceiling + In-rack sprinklers required',
                'new_protection', 'Ceiling-only protection sufficient',
                'table_reference', 'Tables 38-42 show in-rack requirements eliminated'
            );
    END IF;
    
    -- Rule 3: Rack Row Depth Optimization 
    IF rack_row_depth > 6 AND asrs_type = 'mini-load' THEN
        RETURN QUERY SELECT
            'Reduce rack row depth to ≤6 ft to lower sprinkler pressure requirements and improve water penetration.'::TEXT,
            45000.00::DECIMAL,
            'High'::VARCHAR,
            'Significant'::VARCHAR,
            jsonb_build_object(
                'current_depth', rack_row_depth,
                'recommended_depth', 6,
                'impact', 'Reduced sprinkler pressures and densities'
            );
    END IF;
    
    -- Rule 4: System Type Optimization
    IF system_type = 'dry' AND (project_data->>'building_heated')::BOOLEAN = true THEN
        RETURN QUERY SELECT
            'Switch to wet system to reduce sprinkler count requirements (typically 15-25% fewer sprinklers needed).'::TEXT,
            60000.00::DECIMAL,
            'Medium'::VARCHAR,
            'Moderate'::VARCHAR,
            jsonb_build_object(
                'reasoning', 'Heated building allows wet system',
                'benefit', 'Lower sprinkler densities in wet system tables',
                'water_delivery_improvement', 'Faster response time'
            );
    END IF;
    
    -- Rule 5: Commodity Classification Benefits
    IF commodity_class IN ('class_4', 'cartoned_unexpanded_plastic') AND storage_height <= 15 THEN
        RETURN QUERY SELECT
            'Consider reclassifying commodity or improving packaging to Class 1-3 for significant protection reductions.'::TEXT,
            85000.00::DECIMAL,
            'Medium'::VARCHAR,
            'Minimal'::VARCHAR,
            jsonb_build_object(
                'current_class', commodity_class,
                'benefit', 'Class 1-3 commodities have much lower protection requirements',
                'table_comparison', 'Compare Tables 4-5 vs Tables 6-7'
            );
    END IF;
    
    RETURN;
END;
$$;


ALTER FUNCTION "public"."generate_optimization_recommendations"("project_data" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_optimizations"("p_user_input" "jsonb") RETURNS TABLE("optimization_type" "text", "title" "text", "description" "text", "estimated_savings" numeric, "implementation_effort" "text")
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  ceiling_height numeric;
  container_type text;
BEGIN
  -- Extract key parameters
  ceiling_height := (p_user_input->>'ceiling_height')::numeric;
  container_type := p_user_input->>'container_type';
  
  -- Height-based optimizations
  IF ceiling_height > 30 THEN
    RETURN QUERY
    SELECT 
      'cost_reduction'::text,
      'Ceiling Height Optimization'::text,
      format('Reducing ceiling height from %s ft to 30 ft could eliminate enhanced protection requirements', ceiling_height),
      CASE 
        WHEN ceiling_height > 40 THEN 75000::numeric
        WHEN ceiling_height > 35 THEN 45000::numeric
        ELSE 25000::numeric
      END,
      'moderate'::text;
  END IF;
  
  -- Container-based optimizations
  IF container_type LIKE '%open%' OR container_type LIKE '%combustible%' THEN
    RETURN QUERY
    SELECT 
      'alternative_design'::text,
      'Container Configuration Change'::text,
      'Consider closed-top metal containers to eliminate in-rack sprinkler requirements'::text,
      150000::numeric,
      'significant'::text;
  END IF;
  
  RETURN;
END;
$$;


ALTER FUNCTION "public"."generate_optimizations"("p_user_input" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_project_documents"("in_project_id" bigint) RETURNS TABLE("id" "text", "project_id" bigint, "date" timestamp with time zone, "title" "text", "content" "text", "participants" "text", "duration_minutes" integer, "url" "text", "summary" "text")
    LANGUAGE "sql" STABLE
    AS $$
  SELECT id, project_id, date, title, content, participants, duration_minutes, url, summary
  FROM public.document_metadata
  WHERE in_project_id IS NULL OR project_id = in_project_id
  ORDER BY date ASC, id;
$$;


ALTER FUNCTION "public"."get_all_project_documents"("in_project_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_asrs_figure_options"() RETURNS TABLE("asrs_types" "text"[], "container_types" "text"[], "orientation_types" "text"[], "rack_depths" "text"[], "spacings" "text"[])
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ARRAY(SELECT DISTINCT asrs_type FROM asrs_figures WHERE asrs_type IS NOT NULL ORDER BY asrs_type),
        ARRAY(SELECT DISTINCT container_type FROM asrs_figures WHERE container_type IS NOT NULL ORDER BY container_type),
        ARRAY(SELECT DISTINCT orientation_type FROM asrs_figures WHERE orientation_type IS NOT NULL ORDER BY orientation_type),
        ARRAY(SELECT DISTINCT rack_row_depth FROM asrs_figures WHERE rack_row_depth IS NOT NULL ORDER BY rack_row_depth),
        ARRAY(SELECT DISTINCT max_horizontal_spacing FROM asrs_figures WHERE max_horizontal_spacing IS NOT NULL ORDER BY max_horizontal_spacing);
END;
$$;


ALTER FUNCTION "public"."get_asrs_figure_options"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_conversation_with_history"("p_conversation_id" "uuid") RETURNS TABLE("conversation_id" "uuid", "title" "text", "agent_type" "text", "conversation_created_at" timestamp with time zone, "message_id" "uuid", "role" "text", "content" "text", "message_created_at" timestamp with time zone, "message_metadata" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id AS conversation_id,
    c.title,
    c.agent_type,
    c.created_at AS conversation_created_at,
    ch.id AS message_id,
    ch.role,
    ch.content,
    ch.created_at AS message_created_at,
    ch.metadata AS message_metadata
  FROM conversations c
  LEFT JOIN conversation_history ch ON c.id = ch.conversation_id
  WHERE c.id = p_conversation_id
    AND c.user_id = auth.uid()
  ORDER BY ch.created_at ASC;
END;
$$;


ALTER FUNCTION "public"."get_conversation_with_history"("p_conversation_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_document_chunks"("doc_id" "uuid") RETURNS TABLE("chunk_id" "uuid", "content" "text", "chunk_index" integer, "metadata" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id AS chunk_id,
        chunks.content,
        chunks.chunk_index,
        chunks.metadata
    FROM chunks
    WHERE document_id = doc_id
    ORDER BY chunk_index;
END;
$$;


ALTER FUNCTION "public"."get_document_chunks"("doc_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_document_insights_page"("in_page_size" integer, "in_search" "text", "in_sort_by" "text", "in_sort_dir" "text", "in_cursor_created_at" timestamp with time zone, "in_cursor_id" "uuid") RETURNS TABLE("total_count" bigint, "insight_id" "uuid", "insight_title" "text", "insight_description" "text", "insight_type" "text", "confidence_score" numeric, "insight_created_at" timestamp with time zone, "document_id" "uuid", "document_title" "text", "document_url" "text", "document_date" "date", "document_summary" "text", "project_id" "uuid", "project_name" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
  RETURN QUERY
  WITH params AS (
    SELECT
      in_page_size AS page_size,
      coalesce(NULLIF(in_search, ''), '') AS search,
      CASE WHEN in_sort_by = 'confidence_score' THEN 'confidence_score' ELSE 'created_at' END AS sort_by,
      CASE WHEN lower(coalesce(in_sort_dir, 'desc')) = 'asc' THEN 'asc' ELSE 'desc' END AS sort_dir,
      in_cursor_created_at AS cursor_created_at,
      in_cursor_id AS cursor_id
  ),
  filtered AS (
    SELECT
      di.id                 AS insight_id,
      di.title              AS insight_title,
      di.description        AS insight_description,
      di.insight_type,
      di.confidence_score,
      di.created_at         AS insight_created_at,
      dm.id                 AS document_id,
      dm.title              AS document_title,
      dm.url                AS document_url,
      dm.date               AS document_date,
      dm.summary            AS document_summary,
      dm.project_id,
      dm.project            AS project_name,
      (coalesce(di.title,'') || ' ' || coalesce(di.description,'') || ' ' || coalesce(dm.title,'') || ' ' || coalesce(dm.summary,'')) AS search_text
    FROM document_insights di
    JOIN document_metadata dm ON di.document_id = dm.id
  ),
  search_filtered AS (
    SELECT f.*
    FROM filtered f, params p
    WHERE
      (
        p.search = '' OR
        to_tsvector('english', f.search_text) @@ plainto_tsquery('english', p.search)
      )
  ),
  paged AS (
    SELECT sf.*
    FROM search_filtered sf, params p
    WHERE
      (
        p.cursor_created_at IS NULL
        OR
        (p.sort_by = 'created_at' AND (
           (p.sort_dir = 'desc' AND (sf.insight_created_at < p.cursor_created_at
             OR (sf.insight_created_at = p.cursor_created_at AND sf.insight_id < p.cursor_id)))
        OR
           (p.sort_dir = 'asc'  AND (sf.insight_created_at > p.cursor_created_at
             OR (sf.insight_created_at = p.cursor_created_at AND sf.insight_id > p.cursor_id)))
        ))
        OR
        (p.sort_by = 'confidence_score' AND p.cursor_id IS NULL)
        OR
        (p.sort_by = 'confidence_score' AND p.cursor_id IS NOT NULL AND (
           (p.sort_dir = 'desc' AND (sf.confidence_score < (SELECT confidence_score FROM document_insights WHERE id = p.cursor_id) 
             OR (sf.confidence_score = (SELECT confidence_score FROM document_insights WHERE id = p.cursor_id) AND sf.insight_id < p.cursor_id)))
        OR
           (p.sort_dir = 'asc'  AND (sf.confidence_score > (SELECT confidence_score FROM document_insights WHERE id = p.cursor_id)
             OR (sf.confidence_score = (SELECT confidence_score FROM document_insights WHERE id = p.cursor_id) AND sf.insight_id > p.cursor_id)))
        ))
      )
  ),
  ordered AS (
    SELECT p.*
    FROM paged p, params
    ORDER BY p.insight_created_at DESC, p.insight_id
    LIMIT (SELECT page_size FROM params)
  ),
  total_count AS (
    SELECT COUNT(*) AS cnt FROM search_filtered
  )
  SELECT (SELECT cnt FROM total_count) AS total_count,
         o.insight_id, o.insight_title, o.insight_description, o.insight_type, o.confidence_score, o.insight_created_at,
         o.document_id, o.document_title, o.document_url, o.document_date, o.document_summary, o.project_id, o.project_name
  FROM ordered o;
END;
$$;


ALTER FUNCTION "public"."get_document_insights_page"("in_page_size" integer, "in_search" "text", "in_sort_by" "text", "in_sort_dir" "text", "in_cursor_created_at" timestamp with time zone, "in_cursor_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_figures_by_config"("p_asrs_type" character varying, "p_container_type" character varying, "p_orientation_type" character varying DEFAULT 'Horizontal'::character varying) RETURNS TABLE("figure_number" character varying, "name" "text", "rack_row_depth" character varying, "max_horizontal_spacing" character varying, "order_number" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.figure_number,
        f.name,
        f.rack_row_depth,
        f.max_horizontal_spacing,
        f.order_number
    FROM asrs_figures f
    WHERE 
        f.asrs_type = p_asrs_type
        AND f.container_type = p_container_type
        AND (f.orientation_type = p_orientation_type OR f.orientation_type IS NULL)
    ORDER BY f.order_number;
END;
$$;


ALTER FUNCTION "public"."get_figures_by_config"("p_asrs_type" character varying, "p_container_type" character varying, "p_orientation_type" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_fm_global_references_by_topic"("topic" "text", "limit_count" integer DEFAULT 20) RETURNS TABLE("reference_type" "text", "reference_number" "text", "title" "text", "section" "text", "asrs_relevance" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    (
        -- Get tables
        SELECT 
            'table'::text as reference_type,
            t.table_id as reference_number,
            t.title,
            t.asrs_type as section,
            'High'::text as asrs_relevance
        FROM fm_global_tables t
        WHERE t.title ILIKE '%' || topic || '%' 
           OR t.protection_scheme ILIKE '%' || topic || '%'
           OR t.asrs_type ILIKE '%' || topic || '%'
        LIMIT limit_count / 2
    )
    UNION ALL
    (
        -- Get figures
        SELECT 
            'figure'::text as reference_type,
            'Figure ' || f.figure_number::text as reference_number,
            f.title,
            f.figure_type as section,
            'High'::text as asrs_relevance
        FROM fm_global_figures f
        WHERE f.title ILIKE '%' || topic || '%'
           OR f.clean_caption ILIKE '%' || topic || '%'
           OR f.figure_type ILIKE '%' || topic || '%'
        LIMIT limit_count / 2
    );
END;
$$;


ALTER FUNCTION "public"."get_fm_global_references_by_topic"("topic" "text", "limit_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_insights_processing_stats"("p_days_back" integer DEFAULT 30) RETURNS TABLE("total_documents" bigint, "processed_documents" bigint, "total_insights" bigint, "avg_insights_per_document" numeric, "processing_rate" numeric, "top_categories" "jsonb", "recent_activity" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  date_threshold TIMESTAMPTZ := NOW() - (p_days_back || ' days')::INTERVAL;
BEGIN
  RETURN QUERY
  WITH doc_stats AS (
    SELECT 
      COUNT(*) as total_docs,
      COUNT(CASE WHEN ai.document_id IS NOT NULL THEN 1 END) as processed_docs
    FROM document_metadata dm
    LEFT JOIN (SELECT DISTINCT document_id FROM ai_insights) ai ON ai.document_id = dm.id
    WHERE dm.created_at >= date_threshold
      AND dm.content IS NOT NULL 
      AND LENGTH(TRIM(dm.content)) > 200
  ),
  insight_stats AS (
    SELECT 
      COUNT(*) as total_insights,
      COUNT(DISTINCT document_id) as docs_with_insights
    FROM ai_insights ai
    WHERE ai.created_at >= date_threshold::TEXT
  ),
  category_stats AS (
    SELECT jsonb_object_agg(category, doc_count) as categories
    FROM (
      SELECT 
        COALESCE(dm.category, 'uncategorized') as category,
        COUNT(*) as doc_count
      FROM document_metadata dm
      INNER JOIN ai_insights ai ON ai.document_id = dm.id
      WHERE ai.created_at >= date_threshold::TEXT
      GROUP BY dm.category
      ORDER BY doc_count DESC
      LIMIT 10
    ) cat_data
  ),
  activity_stats AS (
    SELECT jsonb_object_agg(date_bucket, insight_count) as activity
    FROM (
      SELECT 
        DATE(ai.created_at::TIMESTAMPTZ) as date_bucket,
        COUNT(*) as insight_count
      FROM ai_insights ai
      WHERE ai.created_at >= date_threshold::TEXT
      GROUP BY DATE(ai.created_at::TIMESTAMPTZ)
      ORDER BY date_bucket DESC
      LIMIT 14
    ) activity_data
  )
  SELECT
    ds.total_docs::BIGINT,
    ds.processed_docs::BIGINT,
    COALESCE(ist.total_insights, 0)::BIGINT,
    CASE 
      WHEN ist.docs_with_insights > 0 
      THEN ROUND(ist.total_insights::NUMERIC / ist.docs_with_insights, 2)
      ELSE 0
    END,
    CASE 
      WHEN ds.total_docs > 0 
      THEN ROUND((ds.processed_docs::NUMERIC / ds.total_docs) * 100, 2)
      ELSE 0
    END,
    COALESCE(cs.categories, '{}'::jsonb),
    COALESCE(act.activity, '{}'::jsonb)
  FROM doc_stats ds
  CROSS JOIN insight_stats ist
  CROSS JOIN category_stats cs
  CROSS JOIN activity_stats act;
END;
$$;


ALTER FUNCTION "public"."get_insights_processing_stats"("p_days_back" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_meeting_analytics"() RETURNS TABLE("total_meetings" bigint, "meetings_by_category" "jsonb", "recent_meetings_count" bigint, "avg_duration_minutes" numeric, "top_participants" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  category_stats jsonb;
  participant_stats jsonb;
BEGIN
  -- Get category distribution
  SELECT jsonb_object_agg(category, count)
  INTO category_stats
  FROM (
    SELECT category, COUNT(*) as count
    FROM document_metadata
    WHERE type = 'meeting_transcript'
    GROUP BY category
    ORDER BY count DESC
  ) category_counts;

  -- Get top participants
  SELECT jsonb_object_agg(participant, count)
  INTO participant_stats
  FROM (
    SELECT 
      unnest(string_to_array(participants, ',')) as participant,
      COUNT(*) as count
    FROM document_metadata
    WHERE type = 'meeting_transcript' AND participants IS NOT NULL
    GROUP BY participant
    ORDER BY count DESC
    LIMIT 10
  ) participant_counts;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM document_metadata WHERE type = 'meeting_transcript'),
    COALESCE(category_stats, '{}'::jsonb),
    (SELECT COUNT(*) FROM document_metadata 
     WHERE type = 'meeting_transcript' 
     AND date >= CURRENT_DATE - INTERVAL '7 days'),
    (SELECT AVG(duration_minutes) FROM document_metadata 
     WHERE type = 'meeting_transcript' AND duration_minutes IS NOT NULL),
    COALESCE(participant_stats, '{}'::jsonb);
END;
$$;


ALTER FUNCTION "public"."get_meeting_analytics"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_meeting_analytics"() IS 'Get comprehensive meeting analytics and statistics';



CREATE OR REPLACE FUNCTION "public"."get_meeting_frequency_stats"("p_days_back" integer DEFAULT 30) RETURNS TABLE("period_date" "date", "meeting_count" bigint, "total_duration_minutes" bigint, "unique_participants" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(m.meeting_date) as period_date,
    COUNT(*) as meeting_count,
    SUM(m.duration_minutes)::BIGINT as total_duration_minutes,
    COUNT(DISTINCT unnest_participants.participant)::BIGINT as unique_participants
  FROM meetings m
  LEFT JOIN LATERAL unnest(m.participants) as unnest_participants(participant) ON true
  WHERE m.meeting_date >= NOW() - (p_days_back || ' days')::INTERVAL
  GROUP BY DATE(m.meeting_date)
  ORDER BY period_date DESC;
END;
$$;


ALTER FUNCTION "public"."get_meeting_frequency_stats"("p_days_back" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_meeting_statistics"() RETURNS TABLE("total_meetings" bigint, "meetings_this_week" bigint, "pending_actions" bigint, "open_risks" bigint, "total_participants" bigint, "avg_duration_minutes" numeric)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT m.id) as total_meetings,
    COUNT(DISTINCT m.id) FILTER (
      WHERE m.meeting_date >= NOW() - INTERVAL '7 days'
    ) as meetings_this_week,
    COUNT(DISTINCT mi.id) FILTER (
      WHERE mi.insight_type = 'action_item' 
      AND mi.status IN ('pending', 'in_progress')
    ) as pending_actions,
    COUNT(DISTINCT mi.id) FILTER (
      WHERE mi.insight_type = 'risk' 
      AND mi.status = 'pending'
    ) as open_risks,
    COUNT(DISTINCT unnest_participants.participant) as total_participants,
    AVG(m.duration_minutes)::NUMERIC(10,1) as avg_duration_minutes
  FROM meetings m
  LEFT JOIN meeting_insights mi ON mi.meeting_id = m.id
  LEFT JOIN LATERAL unnest(m.participants) as unnest_participants(participant) ON true;
END;
$$;


ALTER FUNCTION "public"."get_meeting_statistics"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_page_parents"("page_id" bigint) RETURNS TABLE("id" bigint, "parent_page_id" bigint, "path" "text", "meta" "jsonb")
    LANGUAGE "sql"
    AS $$
  with recursive chain as (
    select *
    from nods_page
    where id = page_id

    union all

    select child.*
      from nods_page as child
      join chain on chain.parent_page_id = child.id
  )
  select id, parent_page_id, path, meta
  from chain;
$$;


ALTER FUNCTION "public"."get_page_parents"("page_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_pending_documents"("p_limit" integer DEFAULT 10, "p_project_id" bigint DEFAULT NULL::bigint, "p_date_from" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_date_to" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_category" "text" DEFAULT NULL::"text", "p_exclude_processed" boolean DEFAULT true) RETURNS TABLE("id" "text", "title" "text", "content" "text", "participants" "text", "category" "text", "date" timestamp with time zone, "duration_minutes" integer, "project_id" bigint, "project" "text", "outline" "text", "bullet_points" "text", "action_items" "text", "entities" "jsonb", "content_length" integer, "has_existing_insights" boolean)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.id,
    dm.title,
    dm.content,
    dm.participants,
    dm.category,
    dm.date,
    dm.duration_minutes,
    dm.project_id,
    dm.project,
    dm.outline,
    dm.bullet_points,
    dm.action_items,
    dm.entities,
    LENGTH(COALESCE(dm.content, '')) as content_length,
    CASE 
      WHEN ai.document_id IS NOT NULL THEN TRUE 
      ELSE FALSE 
    END as has_existing_insights
  FROM document_metadata dm
  LEFT JOIN (
    SELECT DISTINCT document_id 
    FROM ai_insights 
    WHERE document_id IS NOT NULL
  ) ai ON ai.document_id = dm.id
  WHERE
    -- Must have content to process
    dm.content IS NOT NULL 
    AND LENGTH(TRIM(dm.content)) > 200
    
    -- Filter by project if specified
    AND (p_project_id IS NULL OR dm.project_id = p_project_id)
    
    -- Filter by date range if specified
    AND (p_date_from IS NULL OR dm.date >= p_date_from)
    AND (p_date_to IS NULL OR dm.date <= p_date_to)
    
    -- Filter by category if specified
    AND (p_category IS NULL OR dm.category = p_category)
    
    -- Exclude already processed if requested
    AND (p_exclude_processed = FALSE OR ai.document_id IS NULL)
    
    -- Prefer meeting-type documents
    AND (dm.type IS NULL OR dm.type IN ('meeting', 'transcript', 'call'))
    
  ORDER BY
    -- Prioritize recent documents
    dm.date DESC NULLS LAST,
    -- Then by creation date
    dm.created_at DESC NULLS LAST
    
  LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."get_pending_documents"("p_limit" integer, "p_project_id" bigint, "p_date_from" timestamp with time zone, "p_date_to" timestamp with time zone, "p_category" "text", "p_exclude_processed" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_priority_insights"("p_project_id" integer DEFAULT NULL::integer, "p_limit" integer DEFAULT 10) RETURNS TABLE("id" "uuid", "document_id" "text", "project_id" integer, "insight_type" "text", "title" "text", "description" "text", "severity" "text", "assignee" "text", "due_date" "date", "confidence_score" numeric, "days_until_due" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    di.id,
    di.document_id,
    di.project_id,
    di.insight_type,
    di.title,
    di.description,
    di.severity,
    di.assignee,
    di.due_date,
    di.confidence_score,
    CASE
      WHEN di.due_date IS NOT NULL
      THEN EXTRACT(DAY FROM di.due_date - CURRENT_DATE)::INTEGER
      ELSE NULL
    END as days_until_due
  FROM document_insights di
  WHERE
    di.resolved = FALSE
    AND (p_project_id IS NULL OR di.project_id = p_project_id)
    AND di.severity IN ('critical', 'high')
  ORDER BY
    CASE di.severity
      WHEN 'critical' THEN 1
      WHEN 'high' THEN 2
    END,
    di.due_date ASC NULLS LAST,
    di.confidence_score DESC
  LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."get_priority_insights"("p_project_id" integer, "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_project_documents_page"("in_page_size" integer, "in_search" "text", "in_sort_by" "text", "in_sort_dir" "text", "in_cursor_date" timestamp with time zone, "in_cursor_id" "text", "in_project_id" bigint) RETURNS TABLE("total_count" bigint, "id" "text", "project_id" bigint, "date" timestamp with time zone, "title" "text", "content" "text", "participants" "text", "duration_minutes" integer, "url" "text", "summary" "text", "next_cursor_date" timestamp with time zone, "next_cursor_id" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
  RETURN QUERY
  WITH params AS (
    SELECT
      GREATEST(1, COALESCE(in_page_size, 25))::int AS page_size,
      coalesce(NULLIF(in_search, ''), '') AS search,
      CASE WHEN in_sort_by = 'title' THEN 'title' ELSE 'date' END AS sort_by,
      CASE WHEN lower(coalesce(in_sort_dir, 'desc')) = 'asc' THEN 'asc' ELSE 'desc' END AS sort_dir,
      in_cursor_date AS cursor_date,
      coalesce(in_cursor_id, '')::text AS cursor_id,
      in_project_id AS project_id
  ),
  base AS (
    SELECT
      dm.id,
      dm.project_id,
      dm.date,
      dm.title,
      dm.content,
      dm.participants,
      dm.duration_minutes,
      dm.url,
      dm.summary,
      (coalesce(dm.title,'') || ' ' || coalesce(dm.summary,'') || ' ' || coalesce(dm.content,'')) AS search_text
    FROM public.document_metadata dm
    JOIN params p ON true
    WHERE
      (p.project_id IS NULL OR dm.project_id = p.project_id)
  ),
  search_filtered AS (
    SELECT b.*
    FROM base b, params p
    WHERE
      (p.search = '' OR to_tsvector('english', b.search_text) @@ plainto_tsquery('english', p.search))
  ),
  paged AS (
    SELECT sf.*
    FROM search_filtered sf, params p
    WHERE
      (
        p.cursor_date IS NULL
        OR
        (
          p.sort_by = 'date'
          AND (
            (p.sort_dir = 'desc' AND (sf.date < p.cursor_date OR (sf.date = p.cursor_date AND sf.id < NULLIF(p.cursor_id,'')::text)))
         OR (p.sort_dir = 'asc'  AND (sf.date > p.cursor_date OR (sf.date = p.cursor_date AND sf.id > NULLIF(p.cursor_id,'')::text)))
          )
        )
        OR
        (
          p.sort_by = 'title'
          AND (
            (p.sort_dir = 'desc' AND (sf.title < (SELECT title FROM document_metadata WHERE id = NULLIF(p.cursor_id,'')::text) OR (sf.title = (SELECT title FROM document_metadata WHERE id = NULLIF(p.cursor_id,'')::text) AND sf.id < NULLIF(p.cursor_id,'')::text)))
         OR (p.sort_dir = 'asc'  AND (sf.title > (SELECT title FROM document_metadata WHERE id = NULLIF(p.cursor_id,'')::text) OR (sf.title = (SELECT title FROM document_metadata WHERE id = NULLIF(p.cursor_id,'')::text) AND sf.id > NULLIF(p.cursor_id,'')::text)))
          )
        )
      )
  ),
  ordered AS (
    SELECT p.*
    FROM paged p, params
    ORDER BY
      CASE WHEN params.sort_by = 'date' AND params.sort_dir = 'desc' THEN p.date END DESC,
      CASE WHEN params.sort_by = 'date' AND params.sort_dir = 'asc'  THEN p.date END ASC,
      CASE WHEN params.sort_by = 'title' AND params.sort_dir = 'desc' THEN p.title END DESC,
      CASE WHEN params.sort_by = 'title' AND params.sort_dir = 'asc'  THEN p.title END ASC,
      p.id
    LIMIT (SELECT page_size FROM params)
  ),
  total_count AS (
    SELECT COUNT(*) AS cnt FROM search_filtered
  ),
  last_row AS (
    SELECT date AS cursor_date, id AS cursor_id FROM ordered ORDER BY date DESC, id DESC LIMIT 1
  )
  SELECT (SELECT cnt FROM total_count) AS total_count,
         o.id, o.project_id, o.date, o.title, o.content, o.participants, o.duration_minutes, o.url, o.summary,
         lr.cursor_date AS next_cursor_date, lr.cursor_id AS next_cursor_id
  FROM ordered o
  LEFT JOIN last_row lr ON true;
END;
$$;


ALTER FUNCTION "public"."get_project_documents_page"("in_page_size" integer, "in_search" "text", "in_sort_by" "text", "in_sort_dir" "text", "in_cursor_date" timestamp with time zone, "in_cursor_id" "text", "in_project_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_project_matching_context"() RETURNS TABLE("id" bigint, "name" "text", "description" "text", "team_members" "text"[], "stakeholders" "text"[], "keywords" "text"[], "phase" "text", "category" "text", "aliases" "text"[], "active_keywords" "text"[])
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  WITH recent_document_keywords AS (
    SELECT 
      dm.project_id,
      array_agg(DISTINCT word) as doc_keywords
    FROM document_metadata dm
    CROSS JOIN LATERAL (
      SELECT regexp_split_to_table(
        lower(regexp_replace(COALESCE(dm.title, '') || ' ' || COALESCE(dm.content, ''), '[^\w\s]', ' ', 'g')),
        '\s+'
      ) as word
    ) words
    WHERE dm.project_id IS NOT NULL
      AND dm.created_at >= NOW() - INTERVAL '90 days'
      AND LENGTH(word) > 3
      AND word NOT IN ('this', 'that', 'with', 'from', 'they', 'were', 'been', 'have', 'will', 'would', 'could', 'should')
    GROUP BY dm.project_id
  )
  SELECT 
    p.id,
    p.name,
    p.description,
    p.team_members,
    p.stakeholders,
    p.keywords,
    p.phase,
    p.category,
    p.aliases,
    COALESCE(rdk.doc_keywords[1:20], '{}') as active_keywords  -- Top 20 recent keywords
  FROM projects p
  LEFT JOIN recent_document_keywords rdk ON rdk.project_id = p.id
  WHERE p.name IS NOT NULL
  ORDER BY p.id;
END;
$$;


ALTER FUNCTION "public"."get_project_matching_context"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_projects_needing_summary_update"("hours_threshold" integer DEFAULT 24) RETURNS TABLE("project_id" integer, "project_name" "text", "last_update" timestamp with time zone, "hours_since_update" numeric)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as project_id,
        p.name as project_name,
        p.summary_updated_at as last_update,
        EXTRACT(EPOCH FROM (NOW() - COALESCE(p.summary_updated_at, '2000-01-01'::timestamp with time zone))) / 3600 as hours_since_update
    FROM projects p
    WHERE p.name IS NOT NULL
    AND (
        p.summary_updated_at IS NULL 
        OR p.summary_updated_at < NOW() - (hours_threshold || ' hours')::INTERVAL
    )
    ORDER BY p.summary_updated_at ASC NULLS FIRST;
END;
$$;


ALTER FUNCTION "public"."get_projects_needing_summary_update"("hours_threshold" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_recent_project_insights"("p_project_id" "uuid", "p_days_back" integer DEFAULT 30, "p_limit" integer DEFAULT 20) RETURNS TABLE("insight_id" "uuid", "insight_type" "text", "content" "text", "priority" "text", "status" "text", "assigned_to" "text", "due_date" "date", "meeting_id" "uuid", "meeting_title" "text", "meeting_date" timestamp with time zone, "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mi.id as insight_id,
    mi.insight_type,
    mi.content,
    mi.priority,
    mi.status,
    mi.assigned_to,
    mi.due_date,
    m.id as meeting_id,
    m.title as meeting_title,
    m.meeting_date,
    mi.created_at
  FROM meeting_insights mi
  JOIN meetings m ON m.id = mi.meeting_id
  WHERE m.project_id = p_project_id
    AND mi.created_at >= NOW() - (p_days_back || ' days')::INTERVAL
  ORDER BY 
    CASE mi.priority 
      WHEN 'high' THEN 1 
      WHEN 'medium' THEN 2 
      WHEN 'low' THEN 3 
      ELSE 4 
    END,
    mi.created_at DESC
  LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."get_recent_project_insights"("p_project_id" "uuid", "p_days_back" integer, "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_related_content"("chunk_id" "uuid", "max_results" integer DEFAULT 5) RETURNS TABLE("content_type" "text", "title" "text", "summary" "text", "page_number" integer, "relevance_score" double precision)
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  chunk_embedding VECTOR(1536);
  chunk_figures INTEGER[];
  chunk_tables TEXT[];
BEGIN
  -- Get the chunk's embedding and related content
  SELECT tc.embedding, tc.related_figures, tc.related_tables
  INTO chunk_embedding, chunk_figures, chunk_tables
  FROM fm_text_chunks tc WHERE tc.id = chunk_id;
  
  -- Return related figures
  RETURN QUERY
  SELECT 
    'figure'::TEXT as content_type,
    fg.title,
    fg.normalized_summary as summary,
    fg.page_number,
    0.9::FLOAT as relevance_score
  FROM fm_global_figures fg
  WHERE fg.figure_number = ANY(chunk_figures)
  
  UNION ALL
  
  -- Return related tables
  SELECT 
    'table'::TEXT as content_type,
    ft.title,
    COALESCE(ft.title, 'Table data') as summary,
    COALESCE(ft.estimated_page_number::INTEGER, 0) as page_number,
    0.8::FLOAT as relevance_score
  FROM fm_global_tables ft
  WHERE ft.table_id = ANY(chunk_tables)
  
  UNION ALL
  
  -- Return semantically similar chunks
  SELECT 
    'text'::TEXT as content_type,
    COALESCE(tc.chunk_summary, LEFT(tc.raw_text, 100) || '...') as title,
    tc.chunk_summary as summary,
    tc.page_number,
    (1 - (tc.embedding <=> chunk_embedding))::FLOAT as relevance_score
  FROM fm_text_chunks tc
  WHERE tc.id != chunk_id
    AND tc.embedding IS NOT NULL
    AND (tc.embedding <=> chunk_embedding) < 0.3
  
  ORDER BY relevance_score DESC
  LIMIT max_results;
END;
$$;


ALTER FUNCTION "public"."get_related_content"("chunk_id" "uuid", "max_results" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_chat_stats"("p_user_id" "uuid") RETURNS TABLE("total_chats" integer, "total_messages" integer, "total_tokens_used" bigint, "active_chats" integer, "archived_chats" integer, "starred_chats" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT c.id)::INTEGER as total_chats,
        COUNT(DISTINCT m.id)::INTEGER as total_messages,
        COALESCE(SUM(m.total_tokens), 0)::BIGINT as total_tokens_used,
        COUNT(DISTINCT c.id) FILTER (WHERE NOT c.is_archived)::INTEGER as active_chats,
        COUNT(DISTINCT c.id) FILTER (WHERE c.is_archived)::INTEGER as archived_chats,
        COUNT(DISTINCT c.id) FILTER (WHERE c.is_starred)::INTEGER as starred_chats
    FROM chats c
    LEFT JOIN messages m ON c.id = m.chat_id
    WHERE c.user_id = p_user_id;
END;
$$;


ALTER FUNCTION "public"."get_user_chat_stats"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email)
    VALUES (new.id, new.email)
    ON CONFLICT (id) DO NOTHING; -- Prevent errors if profile already exists
    RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."hybrid_search"("query_embedding" "public"."vector", "match_count" integer DEFAULT 5, "filter_project_id" bigint DEFAULT NULL::bigint) RETURNS TABLE("source_type" "text", "id" "uuid", "description" "text", "metadata_id" "uuid", "project_id" bigint, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  
  -- Decisions
  SELECT 
    'decision'::text AS source_type,
    d.id,
    d.description,
    d.metadata_id,
    d.project_id,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM public.decisions d
  WHERE d.embedding IS NOT NULL
    AND (filter_project_id IS NULL OR d.project_id = filter_project_id)
  
  UNION ALL
  
  -- Risks
  SELECT 
    'risk'::text AS source_type,
    r.id,
    r.description,
    r.metadata_id,
    r.project_id,
    1 - (r.embedding <=> query_embedding) AS similarity
  FROM public.risks r
  WHERE r.embedding IS NOT NULL
    AND (filter_project_id IS NULL OR r.project_id = filter_project_id)
  
  UNION ALL
  
  -- Tasks
  SELECT 
    'task'::text AS source_type,
    t.id,
    t.description,
    t.metadata_id,
    t.project_id,
    1 - (t.embedding <=> query_embedding) AS similarity
  FROM public.tasks t
  WHERE t.embedding IS NOT NULL
    AND (filter_project_id IS NULL OR t.project_id = filter_project_id)
  
  UNION ALL
  
  -- Opportunities
  SELECT 
    'opportunity'::text AS source_type,
    o.id,
    o.description,
    o.metadata_id,
    o.project_id,
    1 - (o.embedding <=> query_embedding) AS similarity
  FROM public.opportunities o
  WHERE o.embedding IS NOT NULL
    AND (filter_project_id IS NULL OR o.project_id = filter_project_id)
  
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."hybrid_search"("query_embedding" "public"."vector", "match_count" integer, "filter_project_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."hybrid_search"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer DEFAULT 10, "text_weight" double precision DEFAULT 0.3) RETURNS TABLE("chunk_id" "uuid", "document_id" "uuid", "content" "text", "combined_score" double precision, "vector_similarity" double precision, "text_similarity" double precision, "metadata" "jsonb", "document_title" "text", "document_source" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    WITH vector_results AS (
        SELECT 
            c.id AS chunk_id,
            c.document_id,
            c.content,
            1 - (c.embedding <=> query_embedding) AS vector_sim,
            c.metadata,
            d.title AS doc_title,
            d.source AS doc_source
        FROM chunks c
        JOIN documents d ON c.document_id = d.id
        WHERE c.embedding IS NOT NULL
    ),
    text_results AS (
        SELECT 
            c.id AS chunk_id,
            c.document_id,
            c.content,
            ts_rank_cd(to_tsvector('english', c.content), plainto_tsquery('english', query_text)) AS text_sim,
            c.metadata,
            d.title AS doc_title,
            d.source AS doc_source
        FROM chunks c
        JOIN documents d ON c.document_id = d.id
        WHERE to_tsvector('english', c.content) @@ plainto_tsquery('english', query_text)
    )
    SELECT 
        COALESCE(v.chunk_id, t.chunk_id) AS chunk_id,
        COALESCE(v.document_id, t.document_id) AS document_id,
        COALESCE(v.content, t.content) AS content,
        (COALESCE(v.vector_sim, 0) * (1 - text_weight) + COALESCE(t.text_sim, 0) * text_weight)::float8 AS combined_score,
        COALESCE(v.vector_sim, 0)::float8 AS vector_similarity,
        COALESCE(t.text_sim, 0)::float8 AS text_similarity,
        COALESCE(v.metadata, t.metadata) AS metadata,
        COALESCE(v.doc_title, t.doc_title) AS document_title,
        COALESCE(v.doc_source, t.doc_source) AS document_source
    FROM vector_results v
    FULL OUTER JOIN text_results t ON v.chunk_id = t.chunk_id
    ORDER BY combined_score DESC
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."hybrid_search"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer, "text_weight" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."hybrid_search_fm_global"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer DEFAULT 10, "text_weight" double precision DEFAULT 0.3, "filter_asrs_type" "text" DEFAULT NULL::"text") RETURNS TABLE("vector_id" "uuid", "source_id" "uuid", "source_type" "text", "content" "text", "combined_score" double precision, "vector_similarity" double precision, "text_similarity" double precision, "asrs_topic" "text", "regulation_section" "text", "design_parameter" "text", "metadata" "jsonb", "table_number" "text", "figure_number" "text", "reference_title" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    WITH vector_results AS (
        SELECT 
            v.id,
            v.content_id,
            v.content_type,
            v.content,
            1 - (v.embedding <=> query_embedding) as vector_score,
            v.metadata,
            CASE 
                WHEN v.content_type = 'table' THEN t.asrs_type
                WHEN v.content_type = 'figure' THEN f.asrs_type
                ELSE NULL
            END as asrs_type_val,
            CASE 
                WHEN v.content_type = 'table' THEN t.table_id
                WHEN v.content_type = 'figure' THEN 'Figure ' || f.figure_number::text
                ELSE NULL
            END as reference_number,
            CASE 
                WHEN v.content_type = 'table' THEN t.title
                WHEN v.content_type = 'figure' THEN f.title
                ELSE NULL
            END as reference_title
        FROM fm_global_vectors v
        LEFT JOIN fm_global_tables t ON v.content_id = t.id AND v.content_type = 'table'
        LEFT JOIN fm_global_figures f ON v.content_id = f.id AND v.content_type = 'figure'
        WHERE 
            (filter_asrs_type IS NULL OR 
             (v.content_type = 'table' AND t.asrs_type = filter_asrs_type) OR
             (v.content_type = 'figure' AND f.asrs_type = filter_asrs_type))
        ORDER BY v.embedding <=> query_embedding
        LIMIT match_count * 2
    ),
    text_results AS (
        SELECT 
            v.id,
            v.content_id,
            v.content_type,
            v.content,
            ts_rank(to_tsvector('english', v.content), plainto_tsquery('english', query_text)) as text_score,
            v.metadata,
            CASE 
                WHEN v.content_type = 'table' THEN t.asrs_type
                WHEN v.content_type = 'figure' THEN f.asrs_type
                ELSE NULL
            END as asrs_type_val,
            CASE 
                WHEN v.content_type = 'table' THEN t.table_id
                WHEN v.content_type = 'figure' THEN 'Figure ' || f.figure_number::text
                ELSE NULL
            END as reference_number,
            CASE 
                WHEN v.content_type = 'table' THEN t.title
                WHEN v.content_type = 'figure' THEN f.title
                ELSE NULL
            END as reference_title
        FROM fm_global_vectors v
        LEFT JOIN fm_global_tables t ON v.content_id = t.id AND v.content_type = 'table'
        LEFT JOIN fm_global_figures f ON v.content_id = f.id AND v.content_type = 'figure'
        WHERE 
            to_tsvector('english', v.content) @@ plainto_tsquery('english', query_text)
            AND (filter_asrs_type IS NULL OR 
                 (v.content_type = 'table' AND t.asrs_type = filter_asrs_type) OR
                 (v.content_type = 'figure' AND f.asrs_type = filter_asrs_type))
        LIMIT match_count * 2
    ),
    combined AS (
        SELECT 
            COALESCE(v.id, t.id) as vector_id,
            COALESCE(v.content_id, t.content_id) as source_id,
            COALESCE(v.content_type, t.content_type) as source_type,
            COALESCE(v.content, t.content) as content,
            COALESCE(v.vector_score, 0) * (1 - text_weight) + COALESCE(t.text_score, 0) * text_weight as score,
            COALESCE(v.vector_score, 0) as vector_similarity,
            COALESCE(t.text_score, 0) as text_similarity,
            COALESCE(v.metadata, t.metadata) as metadata,
            COALESCE(v.asrs_type_val, t.asrs_type_val) as asrs_topic,
            COALESCE(v.reference_number, t.reference_number) as reference_number,
            COALESCE(v.reference_title, t.reference_title) as reference_title,
            COALESCE(v.content_type, t.content_type) as content_type_final
        FROM vector_results v
        FULL OUTER JOIN text_results t ON v.id = t.id
    )
    SELECT 
        c.vector_id,
        c.source_id,
        c.source_type,
        c.content,
        c.score as combined_score,
        c.vector_similarity,
        c.text_similarity,
        c.asrs_topic,
        NULL::text as regulation_section,
        NULL::text as design_parameter,
        c.metadata,
        CASE WHEN c.content_type_final = 'table' THEN c.reference_number ELSE NULL END as table_number,
        CASE WHEN c.content_type_final = 'figure' THEN c.reference_number ELSE NULL END as figure_number,
        c.reference_title
    FROM combined c
    ORDER BY c.score DESC
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."hybrid_search_fm_global"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer, "text_weight" double precision, "filter_asrs_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_session_tokens"("session_id" "uuid", "tokens_to_add" integer) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE ai_chat_sessions
  SET total_tokens_used = total_tokens_used + tokens_to_add
  WHERE id = session_id;
END;
$$;


ALTER FUNCTION "public"."increment_session_tokens"("session_id" "uuid", "tokens_to_add" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."interpolate_sprinkler_requirements"("p_table_id" character varying, "p_target_height_ft" integer) RETURNS TABLE("table_id" character varying, "interpolated_height_ft" integer, "k_factor" numeric, "k_type" character varying, "interpolated_count" numeric, "interpolated_pressure" numeric, "lower_height_ft" integer, "upper_height_ft" integer, "note" "text")
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_lower RECORD;
    v_upper RECORD;
BEGIN
    -- Find the lower bound
    SELECT * INTO v_lower
    FROM fm_global_tables
    WHERE table_id = p_table_id
        AND ceiling_height_ft <= p_target_height_ft
        AND sprinkler_count IS NOT NULL
    ORDER BY ceiling_height_ft DESC
    LIMIT 1;
    
    -- Find the upper bound
    SELECT * INTO v_upper
    FROM fm_global_tables
    WHERE table_id = p_table_id
        AND ceiling_height_ft >= p_target_height_ft
        AND sprinkler_count IS NOT NULL
    ORDER BY ceiling_height_ft ASC
    LIMIT 1;
    
    -- If exact match found
    IF v_lower.ceiling_height_ft = p_target_height_ft THEN
        RETURN QUERY
        SELECT 
            v_lower.table_id,
            p_target_height_ft,
            v_lower.k_factor,
            v_lower.k_type,
            v_lower.sprinkler_count::DECIMAL,
            v_lower.pressure_psi,
            v_lower.ceiling_height_ft,
            v_lower.ceiling_height_ft,
            'Exact match found'::TEXT;
    -- If we have both bounds, interpolate
    ELSIF v_lower.ceiling_height_ft IS NOT NULL AND v_upper.ceiling_height_ft IS NOT NULL THEN
        RETURN QUERY
        SELECT 
            v_lower.table_id,
            p_target_height_ft,
            v_lower.k_factor,
            v_lower.k_type,
            -- Linear interpolation for sprinkler count
            v_lower.sprinkler_count + 
                (v_upper.sprinkler_count - v_lower.sprinkler_count) * 
                (p_target_height_ft - v_lower.ceiling_height_ft)::DECIMAL / 
                (v_upper.ceiling_height_ft - v_lower.ceiling_height_ft)::DECIMAL,
            -- Linear interpolation for pressure
            v_lower.pressure_psi + 
                (v_upper.pressure_psi - v_lower.pressure_psi) * 
                (p_target_height_ft - v_lower.ceiling_height_ft)::DECIMAL / 
                (v_upper.ceiling_height_ft - v_lower.ceiling_height_ft)::DECIMAL,
            v_lower.ceiling_height_ft,
            v_upper.ceiling_height_ft,
            FORMAT('Interpolated between %s ft and %s ft', 
                   v_lower.ceiling_height_ft, v_upper.ceiling_height_ft)::TEXT;
    END IF;
END;
$$;


ALTER FUNCTION "public"."interpolate_sprinkler_requirements"("p_table_id" character varying, "p_target_height_ft" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."interpolate_sprinkler_requirements"("p_table_id" character varying, "p_target_height_ft" integer) IS 'Calculate interpolated values between ceiling heights';



CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  SELECT COALESCE(up.is_admin, FALSE) INTO is_admin_user
  FROM user_profiles up
  WHERE up.id = auth.uid();
  
  RETURN is_admin_user;
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mark_document_processed"("p_document_id" "text", "p_insights_count" integer DEFAULT 0, "p_projects_assigned" integer DEFAULT 0) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Update document_metadata with processing info
  UPDATE document_metadata 
  SET entities = COALESCE(entities, '{}'::jsonb) || jsonb_build_object(
    'insights_processing', jsonb_build_object(
      'processed_at', NOW(),
      'insights_generated', p_insights_count,
      'projects_assigned', p_projects_assigned
    )
  )
  WHERE id = p_document_id;
  
  RETURN FOUND;
END;
$$;


ALTER FUNCTION "public"."mark_document_processed"("p_document_id" "text", "p_insights_count" integer, "p_projects_assigned" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_archon_code_examples"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "filter" "jsonb" DEFAULT '{}'::"jsonb", "source_filter" "text" DEFAULT NULL::"text") RETURNS TABLE("id" bigint, "url" character varying, "chunk_number" integer, "content" "text", "summary" "text", "metadata" "jsonb", "source_id" "text", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    id,
    url,
    chunk_number,
    content,
    summary,
    metadata,
    source_id,
    1 - (archon_code_examples.embedding <=> query_embedding) AS similarity
  FROM archon_code_examples
  WHERE metadata @> filter
    AND (source_filter IS NULL OR source_id = source_filter)
  ORDER BY archon_code_examples.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_archon_code_examples"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_archon_crawled_pages"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "filter" "jsonb" DEFAULT '{}'::"jsonb", "source_filter" "text" DEFAULT NULL::"text") RETURNS TABLE("id" bigint, "url" character varying, "chunk_number" integer, "content" "text", "metadata" "jsonb", "source_id" "text", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    id,
    url,
    chunk_number,
    content,
    metadata,
    source_id,
    1 - (archon_crawled_pages.embedding <=> query_embedding) AS similarity
  FROM archon_crawled_pages
  WHERE metadata @> filter
    AND (source_filter IS NULL OR source_id = source_filter)
  ORDER BY archon_crawled_pages.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_archon_crawled_pages"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_chunks"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10) RETURNS TABLE("chunk_id" "uuid", "document_id" "uuid", "content" "text", "similarity" double precision, "metadata" "jsonb", "document_title" "text", "document_source" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id AS chunk_id,
        c.document_id,
        c.content,
        1 - (c.embedding <=> query_embedding) AS similarity,
        c.metadata,
        d.title AS document_title,
        d.source AS document_source
    FROM chunks c
    JOIN documents d ON c.document_id = d.id
    WHERE c.embedding IS NOT NULL
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_chunks"("query_embedding" "public"."vector", "match_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_code_examples"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "filter" "jsonb" DEFAULT '{}'::"jsonb", "source_filter" "text" DEFAULT NULL::"text") RETURNS TABLE("id" bigint, "url" character varying, "chunk_number" integer, "content" "text", "summary" "text", "metadata" "jsonb", "source_id" "text", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    url,
    chunk_number,
    content,
    summary,
    metadata,
    source_id,
    1 - (code_examples.embedding <=> query_embedding) as similarity
  from code_examples
  where metadata @> filter
    AND (source_filter IS NULL OR source_id = source_filter)
  order by code_examples.embedding <=> query_embedding
  limit match_count;
end;
$$;


ALTER FUNCTION "public"."match_code_examples"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_crawled_pages"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "filter" "jsonb" DEFAULT '{}'::"jsonb", "source_filter" "text" DEFAULT NULL::"text") RETURNS TABLE("id" bigint, "url" character varying, "chunk_number" integer, "content" "text", "metadata" "jsonb", "source_id" "text", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    url,
    chunk_number,
    content,
    metadata,
    source_id,
    1 - (crawled_pages.embedding <=> query_embedding) as similarity
  from crawled_pages
  where metadata @> filter
    AND (source_filter IS NULL OR source_id = source_filter)
  order by crawled_pages.embedding <=> query_embedding
  limit match_count;
end;
$$;


ALTER FUNCTION "public"."match_crawled_pages"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_decisions"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "match_threshold" double precision DEFAULT 0.5) RETURNS TABLE("id" "uuid", "metadata_id" "text", "segment_id" "uuid", "description" "text", "rationale" "text", "owner_name" "text", "project_id" integer, "project_ids" integer[], "effective_date" "date", "impact" "text", "status" "text", "created_at" timestamp with time zone, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.id,
        d.metadata_id,
        d.segment_id,
        d.description,
        d.rationale,
        d.owner_name,
        d.project_id,
        d.project_ids,
        d.effective_date,
        d.impact,
        d.status,
        d.created_at,
        1 - (d.embedding <=> query_embedding) AS similarity
    FROM decisions d
    WHERE d.embedding IS NOT NULL
      AND 1 - (d.embedding <=> query_embedding) > match_threshold
    ORDER BY d.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_decisions"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_decisions_by_project"("query_embedding" "public"."vector", "filter_project_ids" integer[], "match_count" integer DEFAULT 10, "match_threshold" double precision DEFAULT 0.3) RETURNS TABLE("id" "uuid", "metadata_id" "text", "segment_id" "uuid", "description" "text", "rationale" "text", "owner_name" "text", "project_id" integer, "project_ids" integer[], "effective_date" "date", "impact" "text", "status" "text", "created_at" timestamp with time zone, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.id,
        d.metadata_id,
        d.segment_id,
        d.description,
        d.rationale,
        d.owner_name,
        d.project_id,
        d.project_ids,
        d.effective_date,
        d.impact,
        d.status,
        d.created_at,
        1 - (d.embedding <=> query_embedding) AS similarity
    FROM decisions d
    WHERE d.embedding IS NOT NULL
      AND (d.project_ids && filter_project_ids OR d.project_id = ANY(filter_project_ids))
      AND 1 - (d.embedding <=> query_embedding) > match_threshold
    ORDER BY d.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_decisions_by_project"("query_embedding" "public"."vector", "filter_project_ids" integer[], "match_count" integer, "match_threshold" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_document_chunks"("query_embedding" "public"."vector", "match_threshold" double precision DEFAULT 0.7, "match_count" integer DEFAULT 10, "filter_document_ids" "uuid"[] DEFAULT NULL::"uuid"[]) RETURNS TABLE("chunk_id" "text", "document_id" "text", "chunk_index" integer, "text" "text", "metadata" "jsonb", "created_at" timestamp with time zone, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dc.chunk_id,
        dc.document_id,
        dc.chunk_index,
        dc.text,
        dc.metadata,
        dc.created_at,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM document_chunks dc
    WHERE 
        (filter_document_ids IS NULL OR dc.document_id = ANY(filter_document_ids::TEXT[]))
        AND dc.embedding IS NOT NULL
        AND 1 - (dc.embedding <=> query_embedding) > match_threshold
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_document_chunks"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_document_ids" "uuid"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from documents d
  where d.embedding is not null
    and d.metadata @> filter
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;


ALTER FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "match_threshold" double precision DEFAULT 0.5, "filter_doc_type" "text" DEFAULT NULL::"text", "filter_project_id" bigint DEFAULT NULL::bigint, "filter_metadata_ids" "uuid"[] DEFAULT NULL::"uuid"[]) RETURNS TABLE("id" "uuid", "metadata_id" "uuid", "segment_id" "uuid", "doc_type" "text", "chunk_index" integer, "content" "text", "meeting_date" "date", "project_id" bigint, "tags" "text"[], "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.metadata_id,
    d.segment_id,
    d.doc_type,
    d.chunk_index,
    d.content,
    d.meeting_date,
    d.project_id,
    d.tags,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM public.documents d
  WHERE 
    d.embedding IS NOT NULL
    AND (1 - (d.embedding <=> query_embedding)) > match_threshold
    AND (filter_doc_type IS NULL OR d.doc_type = filter_doc_type)
    AND (filter_project_id IS NULL OR d.project_id = filter_project_id)
    AND (filter_metadata_ids IS NULL OR d.metadata_id = ANY(filter_metadata_ids))
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_doc_type" "text", "filter_project_id" bigint, "filter_metadata_ids" "uuid"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_documents_enhanced"("query_embedding" "public"."vector", "match_count" integer DEFAULT 5, "category_filter" "text" DEFAULT NULL::"text", "year_filter" integer DEFAULT NULL::integer, "project_filter" "text" DEFAULT NULL::"text", "date_after_filter" timestamp without time zone DEFAULT NULL::timestamp without time zone, "participants_filter" "text" DEFAULT NULL::"text") RETURNS TABLE("id" "text", "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  FROM documents d
  LEFT JOIN document_metadata dm ON dm.id = (d.metadata->>'file_id')
  WHERE 1=1
    -- Category filter
    AND (category_filter IS NULL OR dm.category = category_filter)
    -- Year filter
    AND (year_filter IS NULL OR EXTRACT(YEAR FROM dm.date) = year_filter)
    -- Project filter
    AND (project_filter IS NULL OR dm.project ILIKE '%' || project_filter || '%')
    -- Date after filter
    AND (date_after_filter IS NULL OR dm.date >= date_after_filter)
    -- Participants filter
    AND (participants_filter IS NULL OR dm.participants ILIKE '%' || participants_filter || '%')
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_documents_enhanced"("query_embedding" "public"."vector", "match_count" integer, "category_filter" "text", "year_filter" integer, "project_filter" "text", "date_after_filter" timestamp without time zone, "participants_filter" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."match_documents_enhanced"("query_embedding" "public"."vector", "match_count" integer, "category_filter" "text", "year_filter" integer, "project_filter" "text", "date_after_filter" timestamp without time zone, "participants_filter" "text") IS 'Enhanced document matching with metadata filters for category, year, project, date, and participants';



CREATE OR REPLACE FUNCTION "public"."match_documents_full"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "match_threshold" double precision DEFAULT 0.5) RETURNS TABLE("id" bigint, "file_id" "text", "title" "text", "content" "text", "source" "text", "project_id" integer, "project_ids" integer[], "file_date" "date", "metadata" "jsonb", "created_at" timestamp with time zone, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        doc.id,
        doc.file_id,
        doc.title,
        doc.content,
        doc.source,
        doc.project_id,
        doc.project_ids,
        doc.file_date,
        doc.metadata,
        doc.created_at,
        1 - (doc.embedding <=> query_embedding) AS similarity
    FROM documents doc
    WHERE doc.embedding IS NOT NULL
      AND 1 - (doc.embedding <=> query_embedding) > match_threshold
    ORDER BY doc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_documents_full"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_files"("query_embedding" "public"."vector", "match_count" integer DEFAULT NULL::integer, "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" bigint, "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (files.embedding <=> query_embedding) as similarity
  from files
  where metadata @> filter
  order by files.embedding <=> query_embedding
  limit match_count;
end;
$$;


ALTER FUNCTION "public"."match_files"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_fm_documents"("query_embedding" "public"."vector", "match_threshold" double precision DEFAULT 0.7, "match_count" integer DEFAULT 10) RETURNS TABLE("id" "uuid", "title" "text", "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "sql" STABLE
    AS $$
    SELECT
        fm_documents.id,
        fm_documents.title,
        fm_documents.content,
        fm_documents.metadata,
        1 - (fm_documents.embedding <=> query_embedding) AS similarity
    FROM fm_documents
    WHERE 1 - (fm_documents.embedding <=> query_embedding) > match_threshold
    ORDER BY fm_documents.embedding <=> query_embedding
    LIMIT match_count;
$$;


ALTER FUNCTION "public"."match_fm_documents"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_fm_global_vectors"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "filter_asrs_type" "text" DEFAULT NULL::"text", "filter_source_type" "text" DEFAULT NULL::"text") RETURNS TABLE("vector_id" "uuid", "source_id" "uuid", "source_type" "text", "content" "text", "similarity" double precision, "asrs_topic" "text", "regulation_section" "text", "design_parameter" "text", "metadata" "jsonb", "table_number" "text", "figure_number" "text", "reference_title" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    WITH vector_search AS (
        SELECT 
            v.id as vector_id,
            v.content_id as source_id,
            v.content_type as source_type,
            v.content,
            1 - (v.embedding <=> query_embedding) as similarity,
            v.metadata,
            CASE 
                WHEN v.content_type = 'table' THEN t.asrs_type
                WHEN v.content_type = 'figure' THEN f.asrs_type
                ELSE NULL
            END as asrs_topic,
            CASE 
                WHEN v.content_type = 'table' THEN t.table_id
                WHEN v.content_type = 'figure' THEN 'Figure ' || f.figure_number::text
                ELSE NULL
            END as reference_number,
            CASE 
                WHEN v.content_type = 'table' THEN t.title
                WHEN v.content_type = 'figure' THEN f.title
                ELSE NULL
            END as reference_title
        FROM fm_global_vectors v
        LEFT JOIN fm_global_tables t ON v.content_id = t.id AND v.content_type = 'table'
        LEFT JOIN fm_global_figures f ON v.content_id = f.id AND v.content_type = 'figure'
        WHERE 
            (filter_source_type IS NULL OR v.content_type = filter_source_type)
            AND (filter_asrs_type IS NULL OR 
                 (v.content_type = 'table' AND t.asrs_type = filter_asrs_type) OR
                 (v.content_type = 'figure' AND f.asrs_type = filter_asrs_type))
        ORDER BY v.embedding <=> query_embedding
        LIMIT match_count
    )
    SELECT 
        vs.vector_id,
        vs.source_id,
        vs.source_type,
        vs.content,
        vs.similarity,
        vs.asrs_topic,
        NULL::text as regulation_section,
        NULL::text as design_parameter,
        vs.metadata,
        CASE WHEN vs.source_type = 'table' THEN vs.reference_number ELSE NULL END as table_number,
        CASE WHEN vs.source_type = 'figure' THEN vs.reference_number ELSE NULL END as figure_number,
        vs.reference_title
    FROM vector_search vs;
END;
$$;


ALTER FUNCTION "public"."match_fm_global_vectors"("query_embedding" "public"."vector", "match_count" integer, "filter_asrs_type" "text", "filter_source_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_fm_tables"("query_embedding" "public"."vector", "match_threshold" double precision DEFAULT 0.5, "match_count" integer DEFAULT 10) RETURNS TABLE("table_id" "text", "content_text" "text", "content_type" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ftv.table_id,
    ftv.content_text,
    ftv.content_type,
    ftv.metadata,
    1 - (ftv.embedding <=> query_embedding) as similarity
  FROM fm_table_vectors ftv
  WHERE 1 - (ftv.embedding <=> query_embedding) > match_threshold
  ORDER BY ftv.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_fm_tables"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_fm_tables"("query_embedding" "public"."vector", "match_count" integer DEFAULT 5, "match_threshold" double precision DEFAULT 0.7) RETURNS TABLE("table_id" "text", "title" "text", "asrs_type" "text", "system_type" "text", "similarity" double precision, "metadata" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    ftv.table_id,
    fmt.title,
    fmt.asrs_type,
    fmt.system_type,
    1 - (ftv.embedding <=> query_embedding) AS similarity,
    ftv.metadata
  FROM fm_table_vectors ftv
  JOIN fm_global_tables fmt ON ftv.table_id = fmt.table_id
  WHERE 1 - (ftv.embedding <=> query_embedding) > match_threshold
  ORDER BY ftv.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_fm_tables"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_meeting_chunks"("query_embedding" "public"."vector", "match_count" integer DEFAULT 6, "match_threshold" double precision DEFAULT 0.52, "p_project_id" integer DEFAULT NULL::integer, "p_meeting_id" "uuid" DEFAULT NULL::"uuid") RETURNS TABLE("id" "uuid", "project_id" integer, "meeting_id" "uuid", "chunk_index" integer, "content" "text", "start_timestamp" integer, "end_timestamp" integer, "speaker_info" "jsonb", "similarity" double precision)
    LANGUAGE "sql" STABLE
    AS $$
  /*
    We assume:
      - public.meeting_chunks (
          id uuid, project_id int, meeting_id uuid,
          chunk_index int, content text,
          start_timestamp int, end_timestamp int,
          speaker_info jsonb, embedding vector, ...
        )
      - embedding uses cosine distance ops
  */
  select
    mc.id,
    mc.project_id,
    mc.meeting_id,
    mc.chunk_index,
    mc.content,
    mc.start_timestamp,
    mc.end_timestamp,
    mc.speaker_info,
    1 - (mc.embedding <=> query_embedding) as similarity
  from public.meeting_chunks mc
  where (p_project_id is null or mc.project_id = p_project_id)
    and (p_meeting_id is null or mc.meeting_id = p_meeting_id)
    and 1 - (mc.embedding <=> query_embedding) >= match_threshold
  order by mc.embedding <=> query_embedding asc
  limit match_count;
$$;


ALTER FUNCTION "public"."match_meeting_chunks"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "p_project_id" integer, "p_meeting_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_meeting_chunks_with_project"("query_embedding" "public"."vector", "p_project_id" integer DEFAULT NULL::integer, "match_count" integer DEFAULT 10, "match_threshold" double precision DEFAULT 0.7) RETURNS TABLE("id" "uuid", "meeting_id" "uuid", "content" "text", "similarity" double precision, "speaker_info" "jsonb", "start_timestamp" integer, "project_id" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mc.id,
    mc.meeting_id,
    mc.content,
    1 - (mc.embedding <=> query_embedding) AS similarity,
    mc.speaker_info,
    mc.start_timestamp,
    m.project_id
  FROM meeting_chunks mc
  JOIN meetings m ON m.id = mc.meeting_id
  WHERE 
    1 - (mc.embedding <=> query_embedding) > match_threshold
    AND (p_project_id IS NULL OR m.project_id = p_project_id)
  ORDER BY mc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_meeting_chunks_with_project"("query_embedding" "public"."vector", "p_project_id" integer, "match_count" integer, "match_threshold" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_meeting_segments"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "match_threshold" double precision DEFAULT 0.5) RETURNS TABLE("id" "uuid", "metadata_id" "text", "segment_index" integer, "title" "text", "summary" "text", "decisions" "jsonb", "risks" "jsonb", "tasks" "jsonb", "project_ids" integer[], "created_at" timestamp with time zone, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        ms.id,
        ms.metadata_id,
        ms.segment_index,
        ms.title,
        ms.summary,
        ms.decisions,
        ms.risks,
        ms.tasks,
        ms.project_ids,
        ms.created_at,
        1 - (ms.summary_embedding <=> query_embedding) AS similarity
    FROM meeting_segments ms
    WHERE ms.summary_embedding IS NOT NULL
      AND 1 - (ms.summary_embedding <=> query_embedding) > match_threshold
    ORDER BY ms.summary_embedding <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_meeting_segments"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_meeting_segments_by_project"("query_embedding" "public"."vector", "filter_project_ids" integer[], "match_count" integer DEFAULT 10, "match_threshold" double precision DEFAULT 0.3) RETURNS TABLE("id" "uuid", "metadata_id" "text", "segment_index" integer, "title" "text", "summary" "text", "decisions" "jsonb", "risks" "jsonb", "tasks" "jsonb", "project_ids" integer[], "created_at" timestamp with time zone, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        ms.id,
        ms.metadata_id,
        ms.segment_index,
        ms.title,
        ms.summary,
        ms.decisions,
        ms.risks,
        ms.tasks,
        ms.project_ids,
        ms.created_at,
        1 - (ms.summary_embedding <=> query_embedding) AS similarity
    FROM meeting_segments ms
    WHERE ms.summary_embedding IS NOT NULL
      AND ms.project_ids && filter_project_ids  -- Array overlap operator
      AND 1 - (ms.summary_embedding <=> query_embedding) > match_threshold
    ORDER BY ms.summary_embedding <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_meeting_segments_by_project"("query_embedding" "public"."vector", "filter_project_ids" integer[], "match_count" integer, "match_threshold" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_meetings"("query_embedding" "public"."vector", "match_count" integer DEFAULT 20, "match_threshold" double precision DEFAULT 0.4, "filter_project_id" bigint DEFAULT NULL::bigint, "after_date" timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS TABLE("id" "uuid", "fireflies_id" "text", "title" "text", "started_at" timestamp with time zone, "project_id" bigint, "themes" "text"[], "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    dm.id,
    dm.fireflies_id,
    dm.title,
    dm.started_at,
    dm.project_id,
    dm.themes,
    1 - (dm.summary_embedding <=> query_embedding) AS similarity
  FROM public.document_metadata dm
  WHERE 
    dm.summary_embedding IS NOT NULL
    AND (1 - (dm.summary_embedding <=> query_embedding)) > match_threshold
    AND (filter_project_id IS NULL OR dm.project_id = filter_project_id)
    AND (after_date IS NULL OR dm.started_at >= after_date)
  ORDER BY dm.summary_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_meetings"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_project_id" bigint, "after_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_memories"("query_embedding" "public"."vector", "match_count" integer DEFAULT NULL::integer, "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" bigint, "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (memories.embedding <=> query_embedding) as similarity
  from memories
  where metadata @> filter
  order by memories.embedding <=> query_embedding
  limit match_count;
end;
$$;


ALTER FUNCTION "public"."match_memories"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_opportunities"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "match_threshold" double precision DEFAULT 0.5) RETURNS TABLE("id" "uuid", "metadata_id" "text", "segment_id" "uuid", "description" "text", "type" "text", "owner_name" "text", "project_id" integer, "project_ids" integer[], "next_step" "text", "status" "text", "created_at" timestamp with time zone, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        o.id,
        o.metadata_id,
        o.segment_id,
        o.description,
        o.type,
        o.owner_name,
        o.project_id,
        o.project_ids,
        o.next_step,
        o.status,
        o.created_at,
        1 - (o.embedding <=> query_embedding) AS similarity
    FROM opportunities o
    WHERE o.embedding IS NOT NULL
      AND 1 - (o.embedding <=> query_embedding) > match_threshold
    ORDER BY o.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_opportunities"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_page_sections"("embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "min_content_length" integer) RETURNS TABLE("id" bigint, "page_id" bigint, "slug" "text", "heading" "text", "content" "text", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_variable
begin
  return query
  select
    nods_page_section.id,
    nods_page_section.page_id,
    nods_page_section.slug,
    nods_page_section.heading,
    nods_page_section.content,
    (nods_page_section.embedding <#> embedding) * -1 as similarity
  from nods_page_section

  -- We only care about sections that have a useful amount of content
  where length(nods_page_section.content) >= min_content_length

  -- The dot product is negative because of a Postgres limitation, so we negate it
  and (nods_page_section.embedding <#> embedding) * -1 > match_threshold

  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by nods_page_section.embedding <#> embedding

  limit match_count;
end;
$$;


ALTER FUNCTION "public"."match_page_sections"("embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "min_content_length" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_recent_documents"("query_embedding" "public"."vector", "match_count" integer DEFAULT 6, "days_back" integer DEFAULT 7) RETURNS TABLE("id" "text", "content" "text", "metadata" "jsonb", "similarity" double precision, "document_date" timestamp without time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity,
    dm.date as document_date
  FROM documents d
  LEFT JOIN document_metadata dm ON dm.id = (d.metadata->>'file_id')
  WHERE dm.date >= (CURRENT_DATE - INTERVAL '1 day' * days_back)
  ORDER BY 
    dm.date DESC,
    d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_recent_documents"("query_embedding" "public"."vector", "match_count" integer, "days_back" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."match_recent_documents"("query_embedding" "public"."vector", "match_count" integer, "days_back" integer) IS 'Search recent documents within specified time period with similarity ranking';



CREATE OR REPLACE FUNCTION "public"."match_risks"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "match_threshold" double precision DEFAULT 0.5) RETURNS TABLE("id" "uuid", "metadata_id" "text", "segment_id" "uuid", "description" "text", "category" "text", "likelihood" "text", "impact" "text", "owner_name" "text", "project_id" bigint, "project_ids" bigint[], "mitigation_plan" "text", "status" "text", "created_at" timestamp with time zone, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.metadata_id,
        r.segment_id,
        r.description,
        r.category,
        r.likelihood,
        r.impact,
        r.owner_name,
        r.project_id,
        r.project_ids,
        r.mitigation_plan,
        r.status,
        r.created_at,
        1 - (r.embedding <=> query_embedding) AS similarity
    FROM risks r
    WHERE r.embedding IS NOT NULL
      AND 1 - (r.embedding <=> query_embedding) > match_threshold
    ORDER BY r.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_risks"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_risks_by_project"("query_embedding" "public"."vector", "filter_project_ids" bigint[], "match_count" integer DEFAULT 10, "match_threshold" double precision DEFAULT 0.3) RETURNS TABLE("id" "uuid", "metadata_id" "text", "segment_id" "uuid", "description" "text", "category" "text", "likelihood" "text", "impact" "text", "owner_name" "text", "project_id" bigint, "project_ids" bigint[], "mitigation_plan" "text", "status" "text", "created_at" timestamp with time zone, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.metadata_id,
        r.segment_id,
        r.description,
        r.category,
        r.likelihood,
        r.impact,
        r.owner_name,
        r.project_id,
        r.project_ids,
        r.mitigation_plan,
        r.status,
        r.created_at,
        1 - (r.embedding <=> query_embedding) AS similarity
    FROM risks r
    WHERE r.embedding IS NOT NULL
      AND (r.project_ids && filter_project_ids OR r.project_id = ANY(filter_project_ids))
      AND 1 - (r.embedding <=> query_embedding) > match_threshold
    ORDER BY r.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_risks_by_project"("query_embedding" "public"."vector", "filter_project_ids" bigint[], "match_count" integer, "match_threshold" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_segments"("query_embedding" "public"."vector", "match_count" integer DEFAULT 30, "match_threshold" double precision DEFAULT 0.45, "filter_metadata_ids" "uuid"[] DEFAULT NULL::"uuid"[]) RETURNS TABLE("id" "uuid", "metadata_id" "uuid", "segment_index" integer, "title" "text", "summary" "text", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    ms.id,
    ms.metadata_id,
    ms.segment_index,
    ms.title,
    ms.summary,
    1 - (ms.summary_embedding <=> query_embedding) AS similarity
  FROM public.meeting_segments ms
  WHERE 
    ms.summary_embedding IS NOT NULL
    AND (1 - (ms.summary_embedding <=> query_embedding)) > match_threshold
    AND (filter_metadata_ids IS NULL OR ms.metadata_id = ANY(filter_metadata_ids))
  ORDER BY ms.summary_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_segments"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_metadata_ids" "uuid"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_tasks"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "match_threshold" double precision DEFAULT 0.5, "filter_project_id" bigint DEFAULT NULL::bigint, "filter_status" "text" DEFAULT NULL::"text", "filter_assignee" "text" DEFAULT NULL::"text") RETURNS TABLE("id" "uuid", "metadata_id" "uuid", "description" "text", "assignee_name" "text", "due_date" "date", "priority" "text", "project_id" bigint, "status" "text", "created_at" timestamp with time zone, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.metadata_id,
    t.description,
    t.assignee_name,
    t.due_date,
    t.priority,
    t.project_id,
    t.status,
    t.created_at,
    1 - (t.embedding <=> query_embedding) AS similarity
  FROM public.tasks t
  WHERE 
    t.embedding IS NOT NULL
    AND (1 - (t.embedding <=> query_embedding)) > match_threshold
    AND (filter_project_id IS NULL OR t.project_id = filter_project_id)
    AND (filter_status IS NULL OR t.status = filter_status)
    AND (filter_assignee IS NULL OR t.assignee_email = filter_assignee)
  ORDER BY t.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_tasks"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_project_id" bigint, "filter_status" "text", "filter_assignee" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."normalize_exact_quotes"("in_json" "jsonb") RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  SELECT
    CASE
      WHEN in_json IS NULL THEN ''
      WHEN jsonb_typeof(in_json) = 'array' THEN array_to_string(ARRAY(SELECT jsonb_array_elements_text(in_json)), ' ')
      ELSE coalesce(in_json::text, '')
    END;
$$;


ALTER FUNCTION "public"."normalize_exact_quotes"("in_json" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."populate_insight_names"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Get meeting name
    IF NEW.meeting_id IS NOT NULL THEN
        SELECT title INTO NEW.meeting_name
        FROM meetings
        WHERE id = NEW.meeting_id;
    END IF;
    
    -- Get project name
    IF NEW.project_id IS NOT NULL THEN
        SELECT name INTO NEW.project_name
        FROM projects
        WHERE id = NEW.project_id;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."populate_insight_names"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_budget_rollup"("p_project_id" bigint DEFAULT NULL::bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- For now, always do full refresh with CONCURRENTLY
    -- This allows queries to continue during refresh
    -- Future optimization: could do partial refresh for specific project
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_budget_rollup;
END;
$$;


ALTER FUNCTION "public"."refresh_budget_rollup"("p_project_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_contract_financial_summary"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.contract_financial_summary_mv;
END;
$$;


ALTER FUNCTION "public"."refresh_contract_financial_summary"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_contract_financial_summary_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  PERFORM public.refresh_contract_financial_summary();
  RETURN NULL;  -- statement-level trigger, row return value not needed
END;
$$;


ALTER FUNCTION "public"."refresh_contract_financial_summary_trigger"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_search_vectors"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    UPDATE fm_blocks
    SET    search_vector = to_tsvector('english', source_text)
    WHERE  search_vector IS NULL;
END;
$$;


ALTER FUNCTION "public"."refresh_search_vectors"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_all_knowledge"("query_embedding" "public"."vector", "match_count" integer DEFAULT 20, "match_threshold" double precision DEFAULT 0.4) RETURNS TABLE("source_table" "text", "record_id" "uuid", "content" "text", "metadata" "jsonb", "project_ids" integer[], "created_at" timestamp with time zone, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    (
        -- Decisions
        SELECT
            'decisions'::text AS source_table,
            d.id AS record_id,
            d.description AS content,
            jsonb_build_object(
                'rationale', d.rationale,
                'owner', d.owner_name,
                'impact', d.impact,
                'status', d.status
            ) AS metadata,
            d.project_ids,
            d.created_at,
            1 - (d.embedding <=> query_embedding) AS similarity
        FROM decisions d
        WHERE d.embedding IS NOT NULL
          AND 1 - (d.embedding <=> query_embedding) > match_threshold
    )
    UNION ALL
    (
        -- Risks
        SELECT
            'risks'::text AS source_table,
            r.id AS record_id,
            r.description AS content,
            jsonb_build_object(
                'category', r.category,
                'likelihood', r.likelihood,
                'impact', r.impact,
                'owner', r.owner_name,
                'mitigation', r.mitigation_plan,
                'status', r.status
            ) AS metadata,
            r.project_ids,
            r.created_at,
            1 - (r.embedding <=> query_embedding) AS similarity
        FROM risks r
        WHERE r.embedding IS NOT NULL
          AND 1 - (r.embedding <=> query_embedding) > match_threshold
    )
    UNION ALL
    (
        -- Opportunities
        SELECT
            'opportunities'::text AS source_table,
            o.id AS record_id,
            o.description AS content,
            jsonb_build_object(
                'type', o.type,
                'owner', o.owner_name,
                'next_step', o.next_step,
                'status', o.status
            ) AS metadata,
            o.project_ids,
            o.created_at,
            1 - (o.embedding <=> query_embedding) AS similarity
        FROM opportunities o
        WHERE o.embedding IS NOT NULL
          AND 1 - (o.embedding <=> query_embedding) > match_threshold
    )
    UNION ALL
    (
        -- Meeting Segments
        SELECT
            'meeting_segments'::text AS source_table,
            ms.id AS record_id,
            COALESCE(ms.title, '') || ': ' || COALESCE(ms.summary, '') AS content,
            jsonb_build_object(
                'segment_index', ms.segment_index,
                'decisions_count', jsonb_array_length(ms.decisions),
                'risks_count', jsonb_array_length(ms.risks),
                'tasks_count', jsonb_array_length(ms.tasks)
            ) AS metadata,
            ms.project_ids,
            ms.created_at,
            1 - (ms.summary_embedding <=> query_embedding) AS similarity
        FROM meeting_segments ms
        WHERE ms.summary_embedding IS NOT NULL
          AND 1 - (ms.summary_embedding <=> query_embedding) > match_threshold
    )
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."search_all_knowledge"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_asrs_figures"("p_search_text" "text" DEFAULT NULL::"text", "p_asrs_type" character varying DEFAULT NULL::character varying, "p_container_type" character varying DEFAULT NULL::character varying, "p_orientation_type" character varying DEFAULT NULL::character varying, "p_rack_depth" character varying DEFAULT NULL::character varying, "p_spacing" character varying DEFAULT NULL::character varying) RETURNS TABLE("id" "uuid", "order_number" integer, "figure_number" character varying, "name" "text", "orientation_type" character varying, "asrs_type" character varying, "container_type" character varying, "rack_row_depth" character varying, "max_horizontal_spacing" character varying, "relevance_score" real)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        f.order_number,
        f.figure_number,
        f.name,
        f.orientation_type,
        f.asrs_type,
        f.container_type,
        f.rack_row_depth,
        f.max_horizontal_spacing,
        CASE 
            WHEN p_search_text IS NOT NULL THEN 
                ts_rank(f.search_vector, plainto_tsquery('english', p_search_text))
            ELSE 1.0
        END as relevance_score
    FROM asrs_figures f
    WHERE 
        (p_search_text IS NULL OR f.search_vector @@ plainto_tsquery('english', p_search_text))
        AND (p_asrs_type IS NULL OR f.asrs_type = p_asrs_type)
        AND (p_container_type IS NULL OR f.container_type = p_container_type)
        AND (p_orientation_type IS NULL OR f.orientation_type = p_orientation_type)
        AND (p_rack_depth IS NULL OR f.rack_row_depth = p_rack_depth)
        AND (p_spacing IS NULL OR f.max_horizontal_spacing = p_spacing)
    ORDER BY 
        CASE 
            WHEN p_search_text IS NOT NULL THEN 
                ts_rank(f.search_vector, plainto_tsquery('english', p_search_text))
            ELSE f.order_number
        END DESC;
END;
$$;


ALTER FUNCTION "public"."search_asrs_figures"("p_search_text" "text", "p_asrs_type" character varying, "p_container_type" character varying, "p_orientation_type" character varying, "p_rack_depth" character varying, "p_spacing" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_by_category"("query_embedding" "public"."vector", "category" "text", "match_count" integer DEFAULT 5) RETURNS TABLE("id" "text", "content" "text", "metadata" "jsonb", "similarity" double precision, "meeting_category" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity,
    dm.category as meeting_category
  FROM documents d
  LEFT JOIN document_metadata dm ON dm.id = (d.metadata->>'file_id')
  WHERE dm.category = category
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."search_by_category"("query_embedding" "public"."vector", "category" "text", "match_count" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."search_by_category"("query_embedding" "public"."vector", "category" "text", "match_count" integer) IS 'Search documents by meeting category/type';



CREATE OR REPLACE FUNCTION "public"."search_by_participants"("query_embedding" "public"."vector", "participant_name" "text", "match_count" integer DEFAULT 5) RETURNS TABLE("id" "text", "content" "text", "metadata" "jsonb", "similarity" double precision, "participants" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity,
    dm.participants
  FROM documents d
  LEFT JOIN document_metadata dm ON dm.id = (d.metadata->>'file_id')
  WHERE dm.participants ILIKE '%' || participant_name || '%'
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."search_by_participants"("query_embedding" "public"."vector", "participant_name" "text", "match_count" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."search_by_participants"("query_embedding" "public"."vector", "participant_name" "text", "match_count" integer) IS 'Search documents by participant names';



CREATE OR REPLACE FUNCTION "public"."search_documentation"("query_text" "text", "section_filter" "text" DEFAULT NULL::"text", "limit_count" integer DEFAULT 20) RETURNS TABLE("section_id" character varying, "section_title" character varying, "section_slug" character varying, "block_content" "text", "page_reference" integer, "rank" real)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.section_id,
        s.title        AS section_title,
        s.slug         AS section_slug,
        b.source_text  AS block_content,
        b.page_reference,
        ts_rank(b.search_vector, plainto_tsquery(query_text)) AS rank
    FROM fm_blocks b
    JOIN fm_sections s ON b.section_id = s.id
    WHERE b.search_vector @@ plainto_tsquery(query_text)
      AND (section_filter IS NULL OR s.section_type = section_filter)
      AND s.is_visible = true
    ORDER BY rank DESC
    LIMIT limit_count;
END;
$$;


ALTER FUNCTION "public"."search_documentation"("query_text" "text", "section_filter" "text", "limit_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_fm_global_all"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer DEFAULT 10) RETURNS TABLE("source_id" "text", "source_type" "text", "source_table" "text", "content" "text", "similarity" double precision, "title" "text", "metadata" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    WITH 
    -- Search fm_text_chunks (document chunks with embeddings)
    chunk_results AS (
        SELECT 
            c.id::text as source_id,
            c.content_type as source_type,
            'fm_text_chunks'::text as source_table,
            c.raw_text as content,
            1 - (c.embedding <=> query_embedding) as similarity,
            COALESCE(c.chunk_summary, CONCAT('Chunk from ', c.doc_id)) as title,
            jsonb_build_object(
                'doc_id', c.doc_id,
                'page_number', c.page_number,
                'section_path', c.section_path,
                'related_tables', c.related_tables,
                'related_figures', c.related_figures,
                'topics', c.topics
            ) as metadata
        FROM fm_text_chunks c
        WHERE c.embedding IS NOT NULL
    ),
    
    -- Search fm_table_vectors (table embeddings)
    table_results AS (
        SELECT 
            tv.id::text as source_id,
            tv.content_type as source_type,
            'fm_table_vectors'::text as source_table,
            tv.content_text as content,
            1 - (tv.embedding <=> query_embedding) as similarity,
            CONCAT('Table ', tv.table_id) as title,
            tv.metadata
        FROM fm_table_vectors tv
        WHERE tv.embedding IS NOT NULL
    ),
    
    -- Search fm_global_vectors (if it has data)
    vector_results AS (
        SELECT 
            v.id::text as source_id,
            v.content_type as source_type,
            'fm_global_vectors'::text as source_table,
            v.content,
            1 - (v.embedding <=> query_embedding) as similarity,
            'FM Global Vector' as title,
            v.metadata
        FROM fm_global_vectors v
        WHERE v.embedding IS NOT NULL
    ),
    
    -- Combine all results
    all_results AS (
        SELECT * FROM chunk_results
        UNION ALL
        SELECT * FROM table_results
        UNION ALL
        SELECT * FROM vector_results
    )
    
    SELECT * FROM all_results
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."search_fm_global_all"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_meeting_chunks"("query_embedding" "public"."vector", "match_threshold" double precision DEFAULT 0.7, "match_count" integer DEFAULT 5, "project_filter" "uuid" DEFAULT NULL::"uuid") RETURNS TABLE("id" "uuid", "meeting_id" "uuid", "project_id" "uuid", "chunk_text" "text", "chunk_index" integer, "chunk_start_time" integer, "chunk_end_time" integer, "speaker_info" "jsonb", "similarity" double precision, "meeting_title" "text", "meeting_date" timestamp with time zone, "project_title" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mc.id,
    mc.meeting_id,
    m.project_id,  -- Get project_id from meetings table
    mc.content AS chunk_text,
    mc.chunk_index,
    mc.start_timestamp AS chunk_start_time,
    mc.end_timestamp AS chunk_end_time,
    mc.speaker_info,
    1 - (mc.embedding <=> query_embedding) AS similarity,
    m.title AS meeting_title,
    m.date AS meeting_date,
    p.title AS project_title
  FROM meeting_chunks mc
  JOIN meetings m ON mc.meeting_id = m.id
  LEFT JOIN projects p ON m.project_id = p.id
  WHERE 
    (project_filter IS NULL OR m.project_id = project_filter)
    AND mc.embedding IS NOT NULL
    AND (1 - (mc.embedding <=> query_embedding)) > match_threshold
  ORDER BY mc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."search_meeting_chunks"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "project_filter" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_meeting_chunks"("query_embedding" "public"."vector", "match_threshold" double precision DEFAULT 0.7, "match_count" integer DEFAULT 10, "project_filter" bigint DEFAULT NULL::bigint, "date_from" timestamp with time zone DEFAULT NULL::timestamp with time zone, "date_to" timestamp with time zone DEFAULT NULL::timestamp with time zone, "chunk_types" "text"[] DEFAULT NULL::"text"[]) RETURNS TABLE("chunk_id" "uuid", "meeting_id" "uuid", "project_id" bigint, "chunk_text" "text", "chunk_type" "text", "chunk_index" integer, "similarity" double precision, "meeting_title" "text", "meeting_date" timestamp with time zone, "speakers" "jsonb", "metadata" "jsonb", "rank_score" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  WITH ranked_chunks AS (
    SELECT 
      mc.id AS chunk_id,
      mc.meeting_id,
      m.project_id,
      mc.content AS chunk_text,
      COALESCE(mc.chunk_type, 'transcript') AS chunk_type,
      mc.chunk_index,
      CASE 
        WHEN mc.embedding IS NOT NULL THEN 1 - (mc.embedding <=> query_embedding)
        ELSE 0
      END AS similarity,
      m.title AS meeting_title,
      m.date AS meeting_date,
      mc.speaker_info AS speakers,
      mc.metadata,
      -- Combine similarity with recency and importance
      CASE 
        WHEN mc.embedding IS NOT NULL THEN
          (1 - (mc.embedding <=> query_embedding)) * 
          (1 + 0.1 * COALESCE((mc.metadata->>'importance_score')::FLOAT, 0)) *
          (CASE 
            WHEN m.date > NOW() - INTERVAL '7 days' THEN 1.2
            WHEN m.date > NOW() - INTERVAL '30 days' THEN 1.1
            ELSE 1.0
          END)
        ELSE 0
      END AS rank_score
    FROM meeting_chunks mc
    JOIN meetings m ON mc.meeting_id = m.id
    WHERE 
      -- Vector similarity threshold (only if embedding exists)
      (mc.embedding IS NULL OR (1 - (mc.embedding <=> query_embedding)) > match_threshold)
      -- Optional filters
      AND (project_filter IS NULL OR m.project_id = project_filter)
      AND (date_from IS NULL OR m.date >= date_from)
      AND (date_to IS NULL OR m.date <= date_to)
      AND (chunk_types IS NULL OR COALESCE(mc.chunk_type, 'transcript') = ANY(chunk_types))
  )
  SELECT * FROM ranked_chunks
  WHERE rank_score > 0
  ORDER BY rank_score DESC
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."search_meeting_chunks"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "project_filter" bigint, "date_from" timestamp with time zone, "date_to" timestamp with time zone, "chunk_types" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_meeting_chunks_semantic"("query_embedding" "public"."vector", "match_threshold" double precision DEFAULT 0.5, "match_count" integer DEFAULT 10, "filter_meeting_id" "uuid" DEFAULT NULL::"uuid", "filter_project_id" bigint DEFAULT NULL::bigint) RETURNS TABLE("chunk_id" "uuid", "meeting_id" "uuid", "meeting_title" "text", "chunk_content" "text", "chunk_index" integer, "speaker_info" "jsonb", "similarity" double precision, "project_id" bigint, "meeting_date" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mc.id AS chunk_id,
        mc.meeting_id,
        m.title AS meeting_title,
        mc.content AS chunk_content,
        mc.chunk_index,
        mc.speaker_info,
        1 - (mc.embedding <=> query_embedding) AS similarity,
        m.project_id,
        m.date AS meeting_date
    FROM 
        public.meeting_chunks mc
        INNER JOIN public.meetings m ON mc.meeting_id = m.id
    WHERE 
        mc.embedding IS NOT NULL
        AND (1 - (mc.embedding <=> query_embedding)) > match_threshold
        AND (filter_meeting_id IS NULL OR mc.meeting_id = filter_meeting_id)
        AND (filter_project_id IS NULL OR m.project_id = filter_project_id)
    ORDER BY 
        mc.embedding <=> query_embedding ASC
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."search_meeting_chunks_semantic"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_meeting_id" "uuid", "filter_project_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_meeting_embeddings"("query_embedding" "public"."vector", "match_threshold" double precision DEFAULT 0.7, "match_count" integer DEFAULT 10, "project_filter" integer DEFAULT NULL::integer) RETURNS TABLE("meeting_id" "uuid", "chunk_index" integer, "similarity" double precision, "metadata" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        me.meeting_id::UUID,
        me.chunk_index,
        1 - (me.embedding_vector <=> query_embedding) AS similarity,
        me.metadata
    FROM meeting_embeddings me
    JOIN meetings m ON me.meeting_id = m.id::TEXT
    WHERE 
        (project_filter IS NULL OR m.project_id = project_filter)
        AND (1 - (me.embedding_vector <=> query_embedding)) > match_threshold
    ORDER BY me.embedding_vector <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."search_meeting_embeddings"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "project_filter" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_text_chunks"("search_query" "text", "embedding_vector" "public"."vector" DEFAULT NULL::"public"."vector", "page_filter" integer DEFAULT NULL::integer, "compliance_filter" "text" DEFAULT NULL::"text", "cost_impact_filter" "text" DEFAULT NULL::"text", "match_threshold" double precision DEFAULT 0.8, "max_results" integer DEFAULT 10) RETURNS TABLE("id" "uuid", "raw_text" "text", "chunk_summary" "text", "page_number" integer, "clause_id" "text", "topics" "text"[], "similarity" double precision, "cost_impact" "text", "savings_opportunities" "text"[])
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tc.id,
    tc.raw_text,
    tc.chunk_summary,
    tc.page_number,
    tc.clause_id,
    tc.topics,
    CASE 
      WHEN embedding_vector IS NOT NULL THEN 1 - (tc.embedding <=> embedding_vector)
      ELSE 0.0
    END as similarity,
    tc.cost_impact,
    tc.savings_opportunities
  FROM fm_text_chunks tc
  WHERE 
    -- Keyword search if no embedding provided
    (embedding_vector IS NULL AND (
      tc.raw_text ILIKE '%' || search_query || '%' OR
      tc.chunk_summary ILIKE '%' || search_query || '%' OR
      tc.search_keywords && string_to_array(lower(search_query), ' ')
    ))
    -- Semantic search if embedding provided
    OR (embedding_vector IS NOT NULL AND (tc.embedding <=> embedding_vector) < (1 - match_threshold))
    -- Apply filters
    AND (page_filter IS NULL OR tc.page_number = page_filter)
    AND (compliance_filter IS NULL OR tc.compliance_type = compliance_filter)
    AND (cost_impact_filter IS NULL OR tc.cost_impact = cost_impact_filter)
  ORDER BY 
    CASE 
      WHEN embedding_vector IS NOT NULL THEN (tc.embedding <=> embedding_vector)
      ELSE 0
    END ASC,
    tc.page_number ASC
  LIMIT max_results;
END;
$$;


ALTER FUNCTION "public"."search_text_chunks"("search_query" "text", "embedding_vector" "public"."vector", "page_filter" integer, "compliance_filter" "text", "cost_impact_filter" "text", "match_threshold" double precision, "max_results" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_chunk_doc_title"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- When a chunk is inserted or its meeting reference changes,
    -- fetch the meeting’s date & title and store the combined string.
    SELECT to_char(m.date, 'YYYY-MM-DD') || ' ' || m.title
    INTO   NEW.doc_title
    FROM   public.meetings AS m
    WHERE  m.id = NEW.document_id;   -- adjust column name if needed

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_chunk_doc_title"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_default_severity"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.severity IS NULL THEN
    CASE NEW.insight_type
      WHEN 'action_item' THEN
        NEW.severity := 'high';
      WHEN 'risk' THEN
        NEW.severity := 'high';
      WHEN 'timeline_change' THEN
        NEW.severity := 'critical';
      WHEN 'financial_decision' THEN
        NEW.severity := 'high';
      WHEN 'personnel_issue' THEN
        NEW.severity := 'medium';
      ELSE
        NEW.severity := 'medium';
    END CASE;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_default_severity"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_document_insight_doc_title"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  v_title text;
begin
  -- Safely handle null or empty document_id
  if new.document_id is null then
    return new;
  end if;

  select title into v_title
  from public.document_metadata d
  where d.id = new.document_id
  limit 1;

  if v_title is not null then
    if new.doc_title is distinct from v_title then
      new.doc_title := v_title;
    end if;
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."set_document_insight_doc_title"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_project_id_by_title"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Only act on INSERT, or UPDATE when the title actually changed
  IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND (OLD.title IS DISTINCT FROM NEW.title)) THEN
    IF NEW.title IS NOT NULL THEN
      -- Priority: first match wins
      IF NEW.title ILIKE '%Nieman%' THEN
        NEW.project_id := 38;
      ELSIF NEW.title ILIKE '%Uniqlo%' THEN
        NEW.project_id := 31;
      ELSIF NEW.title ILIKE '%Bloomington%' THEN
        NEW.project_id := 47;
      ELSIF NEW.title ILIKE '%Westfield%' THEN
        NEW.project_id := 43;
      ELSIF NEW.title ILIKE '%Paradise%' THEN
        NEW.project_id := 58;
      ELSIF NEW.title ILIKE '%Accounting%' THEN
        NEW.project_id := 60;
      ELSIF NEW.title ILIKE '%Vermillian%' THEN
        NEW.project_id := 67;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_project_id_by_title"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_project_id_from_title"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF (NEW.title IS NOT NULL) THEN
    -- Only assign when project_id is NULL to avoid overwriting explicit values
    IF NEW.project_id IS NULL THEN
      -- Use IF/ELSIF for clearer control flow
      IF lower(NEW.title) LIKE '%bloomington%' THEN
        NEW.project_id := 47;
      ELSIF lower(NEW.title) LIKE '%accounting%' THEN
        NEW.project_id := 60;
      ELSIF lower(NEW.title) LIKE '%uniqlo%' THEN
        NEW.project_id := 31;
      ELSIF lower(NEW.title) LIKE '%seminole%' THEN
        NEW.project_id := 33;
      ELSIF lower(NEW.title) LIKE '%vermillion%' THEN
        NEW.project_id := 67;
      ELSIF lower(NEW.title) LIKE '%niemann%' THEN
        NEW.project_id := 38;
      ELSIF lower(NEW.title) LIKE '%westfield%' THEN
        NEW.project_id := 43;
      ELSIF lower(NEW.title) LIKE '%paradise%' THEN
        NEW.project_id := 58;
      ELSIF lower(NEW.title) LIKE '%port%' THEN
        NEW.project_id := 34;
      ELSIF lower(NEW.title) LIKE '%crate%' THEN
        NEW.project_id := 53;
      ELSIF lower(NEW.title) LIKE '%ulta%' THEN
        NEW.project_id := 55;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_project_id_from_title"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_supervisor_name"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.supervisor IS NOT NULL AND (NEW.supervisor_name IS NULL OR trim(NEW.supervisor_name) = '')) THEN
      SELECT CONCAT(first_name, ' ', last_name) INTO NEW.supervisor_name FROM public.employees WHERE id = NEW.supervisor;
    END IF;
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.supervisor IS DISTINCT FROM NEW.supervisor) THEN
      IF (NEW.supervisor IS NOT NULL) THEN
        SELECT CONCAT(first_name, ' ', last_name) INTO NEW.supervisor_name FROM public.employees WHERE id = NEW.supervisor;
      ELSE
        NEW.supervisor_name := NULL;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_supervisor_name"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."suggest_project_assignments"("p_document_content" "text", "p_document_title" "text" DEFAULT NULL::"text", "p_participants" "text" DEFAULT NULL::"text", "p_top_matches" integer DEFAULT 5) RETURNS TABLE("project_id" bigint, "project_name" "text", "match_score" numeric, "match_reasons" "text"[])
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  content_words TEXT[];
  title_words TEXT[];
  participant_words TEXT[];
BEGIN
  -- Extract and clean words from inputs
  SELECT array_agg(DISTINCT lower(word)) INTO content_words
  FROM regexp_split_to_table(
    regexp_replace(COALESCE(p_document_content, ''), '[^\w\s]', ' ', 'g'),
    '\s+'
  ) as word
  WHERE LENGTH(word) > 2;
  
  SELECT array_agg(DISTINCT lower(word)) INTO title_words
  FROM regexp_split_to_table(
    regexp_replace(COALESCE(p_document_title, ''), '[^\w\s]', ' ', 'g'),
    '\s+'
  ) as word
  WHERE LENGTH(word) > 2;
  
  SELECT array_agg(DISTINCT lower(word)) INTO participant_words
  FROM regexp_split_to_table(
    regexp_replace(COALESCE(p_participants, ''), '[^\w\s]', ' ', 'g'),
    '\s+'
  ) as word
  WHERE LENGTH(word) > 2;
  
  RETURN QUERY
  WITH project_matches AS (
    SELECT 
      p.id,
      p.name,
      -- Calculate match scores
      (
        -- Exact name match in title (high weight)
        CASE WHEN p.name ILIKE '%' || COALESCE(p_document_title, '') || '%' 
             OR COALESCE(p_document_title, '') ILIKE '%' || p.name || '%'
        THEN 5.0 ELSE 0.0 END +
        
        -- Name match in content (medium weight)
        CASE WHEN p.name ILIKE '%' || COALESCE(p_document_content, '') || '%'
             OR COALESCE(p_document_content, '') ILIKE '%' || p.name || '%'
        THEN 3.0 ELSE 0.0 END +
        
        -- Keyword matches (variable weight)
        COALESCE(
          (SELECT COUNT(*) * 0.5
           FROM unnest(COALESCE(p.keywords, '{}')) kw
           WHERE COALESCE(p_document_content, '') ILIKE '%' || kw || '%'
           OR COALESCE(p_document_title, '') ILIKE '%' || kw || '%'
          ), 0
        ) +
        
        -- Team member matches (high weight)
        COALESCE(
          (SELECT COUNT(*) * 2.0
           FROM unnest(COALESCE(p.team_members, '{}')) tm
           WHERE COALESCE(p_participants, '') ILIKE '%' || tm || '%'
           OR COALESCE(p_document_content, '') ILIKE '%' || tm || '%'
          ), 0
        ) +
        
        -- Stakeholder matches (medium weight)
        COALESCE(
          (SELECT COUNT(*) * 1.0
           FROM unnest(COALESCE(p.stakeholders, '{}')) sh
           WHERE COALESCE(p_participants, '') ILIKE '%' || sh || '%'
           OR COALESCE(p_document_content, '') ILIKE '%' || sh || '%'
          ), 0
        ) +
        
        -- Alias matches (medium weight)
        COALESCE(
          (SELECT COUNT(*) * 1.5
           FROM unnest(COALESCE(p.aliases, '{}')) alias
           WHERE COALESCE(p_document_content, '') ILIKE '%' || alias || '%'
           OR COALESCE(p_document_title, '') ILIKE '%' || alias || '%'
          ), 0
        )
      ) as score,
      
      -- Collect match reasons
      array_remove(ARRAY[
        CASE WHEN p.name ILIKE '%' || COALESCE(p_document_title, '') || '%' 
             OR COALESCE(p_document_title, '') ILIKE '%' || p.name || '%'
        THEN 'Project name in title' END,
        
        CASE WHEN p.name ILIKE '%' || COALESCE(p_document_content, '') || '%'
             OR COALESCE(p_document_content, '') ILIKE '%' || p.name || '%'
        THEN 'Project name in content' END,
        
        CASE WHEN EXISTS(
          SELECT 1 FROM unnest(COALESCE(p.keywords, '{}')) kw
          WHERE COALESCE(p_document_content, '') ILIKE '%' || kw || '%'
          OR COALESCE(p_document_title, '') ILIKE '%' || kw || '%'
        ) THEN 'Keyword match' END,
        
        CASE WHEN EXISTS(
          SELECT 1 FROM unnest(COALESCE(p.team_members, '{}')) tm
          WHERE COALESCE(p_participants, '') ILIKE '%' || tm || '%'
          OR COALESCE(p_document_content, '') ILIKE '%' || tm || '%'
        ) THEN 'Team member match' END,
        
        CASE WHEN EXISTS(
          SELECT 1 FROM unnest(COALESCE(p.stakeholders, '{}')) sh
          WHERE COALESCE(p_participants, '') ILIKE '%' || sh || '%'
          OR COALESCE(p_document_content, '') ILIKE '%' || sh || '%'
        ) THEN 'Stakeholder match' END,
        
        CASE WHEN EXISTS(
          SELECT 1 FROM unnest(COALESCE(p.aliases, '{}')) alias
          WHERE COALESCE(p_document_content, '') ILIKE '%' || alias || '%'
          OR COALESCE(p_document_title, '') ILIKE '%' || alias || '%'
        ) THEN 'Alias match' END
      ], NULL) as reasons
      
    FROM projects p
    WHERE p.name IS NOT NULL
  )
  SELECT 
    pm.id,
    pm.name,
    ROUND(pm.score, 2),
    pm.reasons
  FROM project_matches pm
  WHERE pm.score > 0
  ORDER BY pm.score DESC, pm.name
  LIMIT p_top_matches;
END;
$$;


ALTER FUNCTION "public"."suggest_project_assignments"("p_document_content" "text", "p_document_title" "text", "p_participants" "text", "p_top_matches" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_ai_insights_meeting_name"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    SELECT to_char(m.date, 'YYYY-MM-DD') || ' ' || m.title
    INTO   NEW.meeting_name
    FROM   public.meetings AS m
    WHERE  m.id = NEW.meeting_id;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_ai_insights_meeting_name"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_client"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Fetch the title from the related client
  SELECT name
  INTO NEW.client
  FROM public.clients
  WHERE id = NEW.client_id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_client"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_contacts_company_name"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.company_id IS NOT NULL THEN
    SELECT name INTO NEW.company_name FROM public.companies WHERE id = NEW.company_id;
  ELSE
    NEW.company_name := NULL;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_contacts_company_name"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_cost_codes_division_title"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.division_id IS NOT NULL THEN
    SELECT title INTO NEW.division_title FROM public.cost_code_divisions WHERE id = NEW.division_id;
  ELSE
    NEW.division_title := NULL;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_cost_codes_division_title"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_doc_title"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Fetch the title from the related meeting
  SELECT title
  INTO NEW.doc_title
  FROM public.meetings
  WHERE id = NEW.meeting_id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_doc_title"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_document_insights_project"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.document_id IS NULL THEN
    NEW.project_id := NULL;
    NEW.project_name := NULL;
    RETURN NEW;
  END IF;

  SELECT dm.project_id, dm.project
    INTO NEW.project_id, NEW.project_name
  FROM public.document_metadata dm
  WHERE dm.id = NEW.document_id
  LIMIT 1;

  IF NOT FOUND THEN
    NEW.project_id := NULL;
    NEW.project_name := NULL;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_document_insights_project"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_document_metadata_on_project_name_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  -- only act when the name actually changed
  IF (NEW.name IS DISTINCT FROM OLD.name) THEN
    UPDATE public.document_metadata
    SET project = NEW.name
    WHERE project_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_document_metadata_on_project_name_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_document_metadata_project_from_project_id"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  IF (NEW.project_id IS NULL) THEN
    RETURN NEW;
  END IF;

  UPDATE public.document_metadata
  SET project = p.name
  FROM public.projects p
  WHERE public.document_metadata.id = NEW.id
    AND p.id = NEW.project_id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_document_metadata_project_from_project_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_document_project_name"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.project_id IS NULL THEN
    NEW.project := NULL;
    RETURN NEW;
  END IF;

  SELECT name INTO NEW.project FROM public.projects WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_document_project_name"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_insight_project_from_document"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.document_id IS NULL THEN
    NEW.project_id := NULL;
    NEW.project_name := NULL;
    RETURN NEW;
  END IF;

  -- Fetch project_id and project name from document_metadata
  SELECT dm.project_id, dm.project
    INTO NEW.project_id, NEW.project_name
  FROM public.document_metadata dm
  WHERE dm.id = NEW.document_id
  LIMIT 1;

  -- If no match, ensure fields are null
  IF NOT FOUND THEN
    NEW.project_id := NULL;
    NEW.project_name := NULL;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_insight_project_from_document"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_meeting_title"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Fetch the title from the related meeting
  SELECT title
  INTO NEW.meeting_title
  FROM public.meetings
  WHERE id = NEW.meeting_id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_meeting_title"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_project"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Fetch the title from the related project
  SELECT name
  INTO NEW.project
  FROM public.projects
  WHERE id = NEW.project_id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_project"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_project_title"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Fetch the title from the related project
  SELECT name
  INTO NEW.project_title
  FROM public.projects
  WHERE id = NEW.project_id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_project_title"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."text_search_chunks"("search_query" "text", "match_count" integer DEFAULT 10) RETURNS TABLE("chunk_id" "uuid", "doc_id" "text", "content" "text", "chunk_summary" "text", "page_number" integer, "section_path" "text"[], "related_tables" "text"[], "related_figures" "text"[])
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as chunk_id,
        c.doc_id,
        c.raw_text as content,
        c.chunk_summary,
        c.page_number,
        c.section_path,
        c.related_tables,
        c.related_figures
    FROM fm_text_chunks c
    WHERE 
        c.raw_text ILIKE '%' || search_query || '%'
        OR c.chunk_summary ILIKE '%' || search_query || '%'
        OR search_query = ANY(c.search_keywords)
        OR search_query = ANY(c.topics)
    ORDER BY 
        CASE 
            WHEN c.chunk_summary ILIKE '%' || search_query || '%' THEN 1
            WHEN c.raw_text ILIKE '%' || search_query || '%' THEN 2
            ELSE 3
        END
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."text_search_chunks"("search_query" "text", "match_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."track_submittal_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO submittal_history (
            submittal_id, 
            action, 
            description, 
            previous_status, 
            new_status,
            changes
        ) VALUES (
            NEW.id,
            'status_changed',
            'Status changed from ' || OLD.status || ' to ' || NEW.status,
            OLD.status,
            NEW.status,
            jsonb_build_object('field', 'status', 'old_value', OLD.status, 'new_value', NEW.status)
        );
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."track_submittal_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_app_users_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_app_users_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_chat_last_message_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    UPDATE chats
    SET last_message_at = NOW()
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_chat_last_message_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_document_project_assignment"("p_document_id" "text", "p_project_id" bigint, "p_confidence" numeric DEFAULT NULL::numeric, "p_reasoning" "text" DEFAULT NULL::"text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  project_name TEXT;
BEGIN
  -- Get project name for reference
  SELECT name INTO project_name 
  FROM projects 
  WHERE id = p_project_id;
  
  -- Update document_metadata with project assignment
  UPDATE document_metadata 
  SET 
    project_id = p_project_id,
    project = project_name,
    entities = COALESCE(entities, '{}'::jsonb) || jsonb_build_object(
      'project_assignment', jsonb_build_object(
        'assigned_at', NOW(),
        'confidence', p_confidence,
        'reasoning', p_reasoning,
        'method', 'ai_worker'
      )
    )
  WHERE id = p_document_id;
  
  RETURN FOUND;
END;
$$;


ALTER FUNCTION "public"."update_document_project_assignment"("p_document_id" "text", "p_project_id" bigint, "p_confidence" numeric, "p_reasoning" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_initiatives_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_initiatives_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_insight_names"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Update meeting name if meeting_id changed
    IF NEW.meeting_id IS DISTINCT FROM OLD.meeting_id THEN
        IF NEW.meeting_id IS NOT NULL THEN
            SELECT title INTO NEW.meeting_name
            FROM meetings
            WHERE id = NEW.meeting_id;
        ELSE
            NEW.meeting_name := NULL;
        END IF;
    END IF;
    
    -- Update project name if project_id changed
    IF NEW.project_id IS DISTINCT FROM OLD.project_id THEN
        IF NEW.project_id IS NOT NULL THEN
            SELECT name INTO NEW.project_name
            FROM projects
            WHERE id = NEW.project_id;
        ELSE
            NEW.project_name := NULL;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_insight_names"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_meeting_chunks_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_meeting_chunks_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_rag_pipeline_state_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_rag_pipeline_state_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_search_vector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.search_vector = to_tsvector('english', NEW.source_text);
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_search_vector"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;


ALTER FUNCTION "public"."update_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_project_assignment"("p_document_id" "text", "p_project_id" bigint) RETURNS TABLE("is_valid" boolean, "confidence" numeric, "validation_notes" "text"[])
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  doc_record RECORD;
  proj_record RECORD;
  notes TEXT[] := '{}';
  conf_score NUMERIC := 0;
BEGIN
  -- Get document data
  SELECT * INTO doc_record
  FROM document_metadata 
  WHERE id = p_document_id;
  
  -- Get project data
  SELECT * INTO proj_record
  FROM projects 
  WHERE id = p_project_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0::NUMERIC, ARRAY['Project not found'];
    RETURN;
  END IF;
  
  IF doc_record IS NULL THEN
    RETURN QUERY SELECT FALSE, 0::NUMERIC, ARRAY['Document not found'];
    RETURN;
  END IF;
  
  -- Validation checks
  
  -- Check for explicit project name mention
  IF doc_record.title ILIKE '%' || proj_record.name || '%' 
     OR doc_record.content ILIKE '%' || proj_record.name || '%' THEN
    conf_score := conf_score + 0.4;
    notes := notes || 'Project name explicitly mentioned';
  END IF;
  
  -- Check team member overlap
  IF EXISTS (
    SELECT 1 FROM unnest(COALESCE(proj_record.team_members, '{}')) tm
    WHERE doc_record.participants ILIKE '%' || tm || '%'
  ) THEN
    conf_score := conf_score + 0.3;
    notes := notes || 'Team member participation confirmed';
  END IF;
  
  -- Check keyword relevance
  IF EXISTS (
    SELECT 1 FROM unnest(COALESCE(proj_record.keywords, '{}')) kw
    WHERE doc_record.content ILIKE '%' || kw || '%'
  ) THEN
    conf_score := conf_score + 0.2;
    notes := notes || 'Relevant keywords found';
  END IF;
  
  -- Check if document already has different project assignment
  IF doc_record.project_id IS NOT NULL AND doc_record.project_id != p_project_id THEN
    conf_score := conf_score - 0.2;
    notes := notes || 'Conflicts with existing assignment';
  END IF;
  
  -- Determine validity
  RETURN QUERY SELECT 
    (conf_score >= 0.3),
    GREATEST(conf_score, 0),
    notes;
END;
$$;


ALTER FUNCTION "public"."validate_project_assignment"("p_document_id" "text", "p_project_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."vector_search"("query_embedding" "public"."vector", "match_count" integer DEFAULT 10, "match_threshold" double precision DEFAULT 0.7) RETURNS TABLE("id" "uuid", "content" "text", "meeting_id" "uuid", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mc.id,
    mc.content,
    mc.meeting_id,
    1 - (mc.embedding <=> query_embedding) as similarity
  FROM meeting_chunks mc
  WHERE mc.embedding IS NOT NULL
    AND 1 - (mc.embedding <=> query_embedding) > match_threshold
  ORDER BY mc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."vector_search"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) OWNER TO "postgres";


CREATE FOREIGN DATA WRAPPER "wasm_wrapper" HANDLER "extensions"."wasm_fdw_handler" VALIDATOR "extensions"."wasm_fdw_validator";




CREATE SERVER "notion_server" FOREIGN DATA WRAPPER "wasm_wrapper" OPTIONS (
    "api_key_id" 'aef0e6c6-aeee-4c20-8221-0ff6a45068ca',
    "api_url" 'https://api.notion.com/v1',
    "fdw_package_checksum" '6dea3014f462aafd0c051c37d163fe326e7650c26a7eb5d8017a30634b5a46de',
    "fdw_package_name" 'supabase:notion-fdw',
    "fdw_package_url" 'https://github.com/supabase/wrappers/releases/download/wasm_notion_fdw_v0.1.1/notion_fdw.wasm',
    "fdw_package_version" '0.1.1'
);


ALTER SERVER "notion_server" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
    "id" integer NOT NULL,
    "hash" "text" NOT NULL,
    "created_at" bigint
);


ALTER TABLE "drizzle"."__drizzle_migrations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "drizzle"."__drizzle_migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNED BY "drizzle"."__drizzle_migrations"."id";



CREATE TABLE IF NOT EXISTS "next_auth"."accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL,
    "provider" "text" NOT NULL,
    "providerAccountId" "text" NOT NULL,
    "refresh_token" "text",
    "access_token" "text",
    "expires_at" bigint,
    "token_type" "text",
    "scope" "text",
    "id_token" "text",
    "session_state" "text",
    "oauth_token_secret" "text",
    "oauth_token" "text",
    "userId" "uuid"
);


ALTER TABLE "next_auth"."accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "next_auth"."sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "expires" timestamp with time zone NOT NULL,
    "sessionToken" "text" NOT NULL,
    "userId" "uuid"
);


ALTER TABLE "next_auth"."sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "next_auth"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text",
    "email" "text",
    "emailVerified" timestamp with time zone,
    "image" "text"
);


ALTER TABLE "next_auth"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "next_auth"."verification_tokens" (
    "identifier" "text",
    "token" "text" NOT NULL,
    "expires" timestamp with time zone NOT NULL
);


ALTER TABLE "next_auth"."verification_tokens" OWNER TO "postgres";


CREATE FOREIGN TABLE "notion"."blocks" (
    "id" "text",
    "page_id" "text",
    "type" "text",
    "created_time" timestamp without time zone,
    "last_edited_time" timestamp without time zone,
    "archived" boolean,
    "attrs" "jsonb"
)
SERVER "notion_server"
OPTIONS (
    "object" 'block'
);


ALTER FOREIGN TABLE "notion"."blocks" OWNER TO "postgres";


CREATE FOREIGN TABLE "notion"."databases" (
    "id" "text",
    "url" "text",
    "created_time" timestamp without time zone,
    "last_edited_time" timestamp without time zone,
    "archived" boolean,
    "attrs" "jsonb"
)
SERVER "notion_server"
OPTIONS (
    "object" 'database'
);


ALTER FOREIGN TABLE "notion"."databases" OWNER TO "postgres";


CREATE FOREIGN TABLE "notion"."pages" (
    "id" "text",
    "url" "text",
    "created_time" timestamp without time zone,
    "last_edited_time" timestamp without time zone,
    "archived" boolean,
    "attrs" "jsonb"
)
SERVER "notion_server"
OPTIONS (
    "object" 'page'
);


ALTER FOREIGN TABLE "notion"."pages" OWNER TO "postgres";


CREATE FOREIGN TABLE "notion"."users" (
    "id" "text",
    "name" "text",
    "type" "text",
    "avatar_url" "text",
    "attrs" "jsonb"
)
SERVER "notion_server"
OPTIONS (
    "object" 'user'
);


ALTER FOREIGN TABLE "notion"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "private"."document_processing_queue" (
    "id" bigint NOT NULL,
    "document_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "attempted" smallint DEFAULT 0 NOT NULL,
    "error" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "private"."document_processing_queue" OWNER TO "postgres";


ALTER TABLE "private"."document_processing_queue" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "private"."document_processing_queue_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Prospects" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "contact" bigint,
    "status" "text"
);


ALTER TABLE "public"."Prospects" OWNER TO "postgres";


ALTER TABLE "public"."Prospects" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Prospects_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."__drizzle_migrations" (
    "hash" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."__drizzle_migrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."document_insights" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "document_id" "text" NOT NULL,
    "project_id" integer,
    "insight_type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "confidence_score" numeric(3,2) DEFAULT 0.0,
    "generated_by" "text" DEFAULT 'llama-3.1-8b'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "doc_title" "text",
    "severity" character varying(20),
    "business_impact" "text",
    "assignee" "text",
    "due_date" "date",
    "financial_impact" numeric(12,2),
    "urgency_indicators" "text"[],
    "resolved" boolean DEFAULT false,
    "source_meetings" "text"[],
    "dependencies" "text"[],
    "stakeholders_affected" "text"[],
    "exact_quotes" "text"[],
    "numerical_data" "jsonb",
    "critical_path_impact" boolean DEFAULT false,
    "cross_project_impact" integer[],
    "document_date" "date",
    "project_name" "text",
    CONSTRAINT "document_insights_confidence_score_check" CHECK ((("confidence_score" >= 0.0) AND ("confidence_score" <= 1.0))),
    CONSTRAINT "document_insights_severity_check" CHECK ((("severity")::"text" = ANY ((ARRAY['critical'::character varying, 'high'::character varying, 'medium'::character varying, 'low'::character varying])::"text"[])))
);


ALTER TABLE "public"."document_insights" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."document_metadata" (
    "id" "text" NOT NULL,
    "title" "text",
    "url" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "type" "text",
    "source" "text",
    "content" "text",
    "summary" "text",
    "participants" "text",
    "tags" "text",
    "category" "text",
    "fireflies_id" "text",
    "fireflies_link" "text",
    "project_id" bigint,
    "project" "text",
    "date" timestamp with time zone,
    "duration_minutes" integer,
    "bullet_points" "text",
    "action_items" "text",
    "file_id" integer,
    "overview" "text",
    "description" "text",
    "status" "text",
    "access_level" "text" DEFAULT 'team'::"text",
    "captured_at" timestamp with time zone,
    "content_hash" "text",
    "participants_array" "text"[],
    "phase" "text" DEFAULT 'Current'::"text" NOT NULL,
    "audio" "text",
    "video" "text"
);


ALTER TABLE "public"."document_metadata" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "job number" "text",
    "start date" "date",
    "est completion" "date",
    "est revenue" numeric,
    "est profit" numeric,
    "address" "text",
    "onedrive" "text",
    "phase" "text",
    "state" "text",
    "client_id" bigint,
    "category" "text",
    "aliases" "text"[] DEFAULT '{}'::"text"[],
    "team_members" "text"[] DEFAULT '{}'::"text"[],
    "current_phase" character varying(100),
    "completion_percentage" integer DEFAULT 0,
    "budget" numeric(12,2),
    "budget_used" numeric(12,2) DEFAULT 0,
    "client" "text",
    "summary" "text",
    "summary_metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "summary_updated_at" timestamp with time zone,
    "health_score" numeric(5,2),
    "health_status" "text",
    "access" "text",
    "archived" boolean DEFAULT false NOT NULL,
    "archived_by" "uuid",
    "archived_at" timestamp with time zone,
    "erp_system" "text",
    "erp_last_job_cost_sync" timestamp with time zone,
    "erp_last_direct_cost_sync" timestamp with time zone,
    "erp_sync_status" "text",
    "project_manager" bigint,
    "type" "text",
    "project_number" character varying(50),
    "stakeholders" "jsonb" DEFAULT '[]'::"jsonb",
    "keywords" "text"[],
    "budget_locked" boolean DEFAULT false,
    "budget_locked_at" timestamp with time zone,
    "budget_locked_by" "uuid",
    "work_scope" "text",
    "project_sector" "text",
    "delivery_method" "text",
    "name_code" "text",
    CONSTRAINT "projects_delivery_method_check" CHECK ((("delivery_method" IS NULL) OR ("delivery_method" = ANY (ARRAY['Design-Bid-Build'::"text", 'Design-Build'::"text", 'Construction Management at Risk'::"text", 'Integrated Project Delivery'::"text"])))),
    CONSTRAINT "projects_health_status_check" CHECK (("health_status" = ANY (ARRAY['Healthy'::"text", 'At Risk'::"text", 'Needs Attention'::"text", 'Critical'::"text"]))),
    CONSTRAINT "projects_project_sector_check" CHECK ((("project_sector" IS NULL) OR ("project_sector" = ANY (ARRAY['Commercial'::"text", 'Industrial'::"text", 'Infrastructure'::"text", 'Healthcare'::"text", 'Institutional'::"text", 'Residential'::"text"])))),
    CONSTRAINT "projects_work_scope_check" CHECK ((("work_scope" IS NULL) OR ("work_scope" = ANY (ARRAY['Ground-Up Construction'::"text", 'Renovation'::"text", 'Tenant Improvement'::"text", 'Interior Build-Out'::"text", 'Maintenance'::"text"]))))
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


COMMENT ON COLUMN "public"."projects"."onedrive" IS 'Link to One Drive folder';



COMMENT ON COLUMN "public"."projects"."work_scope" IS 'Type of construction work (Ground-Up, Renovation, Tenant Improvement, Interior Build-Out, Maintenance)';



COMMENT ON COLUMN "public"."projects"."project_sector" IS 'Industry sector (Commercial, Industrial, Infrastructure, Healthcare, Institutional, Residential)';



COMMENT ON COLUMN "public"."projects"."delivery_method" IS 'Project delivery method (Design-Bid-Build, Design-Build, Construction Management at Risk, Integrated Project Delivery)';



CREATE OR REPLACE VIEW "public"."actionable_insights" AS
 SELECT "di"."id",
    "di"."document_id",
    "di"."project_id",
    "di"."insight_type",
    "di"."title",
    "di"."description",
    "di"."confidence_score",
    "di"."generated_by",
    "di"."created_at",
    "di"."metadata",
    "di"."doc_title",
    "di"."severity",
    "di"."business_impact",
    "di"."assignee",
    "di"."due_date",
    "di"."financial_impact",
    "di"."urgency_indicators",
    "di"."resolved",
    "di"."source_meetings",
    "di"."dependencies",
    "di"."stakeholders_affected",
    "di"."exact_quotes",
    "di"."numerical_data",
    "di"."critical_path_impact",
    "di"."cross_project_impact",
    "dm"."title" AS "document_title",
    "dm"."type" AS "document_type",
    "dm"."date" AS "meeting_date",
    "p"."name" AS "project_name"
   FROM (("public"."document_insights" "di"
     LEFT JOIN "public"."document_metadata" "dm" ON (("di"."document_id" = "dm"."id")))
     LEFT JOIN "public"."projects" "p" ON (("di"."project_id" = "p"."id")))
  WHERE (("di"."resolved" = false) AND (("di"."severity")::"text" = ANY ((ARRAY['critical'::character varying, 'high'::character varying])::"text"[])))
  ORDER BY
        CASE "di"."severity"
            WHEN 'critical'::"text" THEN 1
            WHEN 'high'::"text" THEN 2
            WHEN 'medium'::"text" THEN 3
            WHEN 'low'::"text" THEN 4
            ELSE NULL::integer
        END, "di"."due_date", "di"."confidence_score" DESC;


ALTER VIEW "public"."actionable_insights" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."active_submittals" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::integer AS "project_id",
    NULL::"uuid" AS "specification_id",
    NULL::"uuid" AS "submittal_type_id",
    NULL::character varying(100) AS "submittal_number",
    NULL::character varying(255) AS "title",
    NULL::"text" AS "description",
    NULL::"uuid" AS "submitted_by",
    NULL::character varying(255) AS "submitter_company",
    NULL::timestamp with time zone AS "submission_date",
    NULL::"date" AS "required_approval_date",
    NULL::character varying(50) AS "priority",
    NULL::character varying(50) AS "status",
    NULL::integer AS "current_version",
    NULL::integer AS "total_versions",
    NULL::"jsonb" AS "metadata",
    NULL::timestamp with time zone AS "created_at",
    NULL::timestamp with time zone AS "updated_at",
    NULL::"text" AS "project_name",
    NULL::character varying(64) AS "submitted_by_email",
    NULL::character varying(255) AS "submittal_type_name",
    NULL::bigint AS "discrepancy_count",
    NULL::bigint AS "critical_discrepancies";


ALTER VIEW "public"."active_submittals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_analysis_jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "submittal_id" "uuid" NOT NULL,
    "job_type" character varying(100) NOT NULL,
    "status" character varying(50) DEFAULT 'queued'::character varying,
    "model_version" character varying(50),
    "config" "jsonb",
    "input_data" "jsonb",
    "results" "jsonb",
    "confidence_metrics" "jsonb",
    "processing_time_ms" integer,
    "error_message" "text",
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "ai_analysis_jobs_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['queued'::character varying, 'processing'::character varying, 'completed'::character varying, 'failed'::character varying, 'cancelled'::character varying])::"text"[])))
);


ALTER TABLE "public"."ai_analysis_jobs" OWNER TO "postgres";


COMMENT ON TABLE "public"."ai_analysis_jobs" IS 'Tracking AI analysis jobs and their results for submittals';



CREATE TABLE IF NOT EXISTS "public"."ai_insights" (
    "id" bigint NOT NULL,
    "project_id" bigint,
    "insight_type" "text",
    "severity" "text",
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "source_meetings" "text",
    "confidence_score" real,
    "resolved" integer DEFAULT 0,
    "created_at" "text" DEFAULT CURRENT_TIMESTAMP,
    "meeting_id" "uuid",
    "meeting_name" "text",
    "project_name" "text",
    "document_id" "uuid",
    "status" "text" DEFAULT 'open'::"text",
    "assigned_to" "text",
    "due_date" "date",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "resolved_at" timestamp with time zone,
    "business_impact" "text",
    "assignee" "text",
    "dependencies" "jsonb" DEFAULT '[]'::"jsonb",
    "financial_impact" numeric,
    "timeline_impact_days" integer,
    "stakeholders_affected" "text"[],
    "exact_quotes" "jsonb" DEFAULT '[]'::"jsonb",
    "numerical_data" "jsonb" DEFAULT '[]'::"jsonb",
    "urgency_indicators" "text"[],
    "cross_project_impact" integer[],
    "chunks_id" "uuid",
    "meeting_date" timestamp with time zone,
    "exact_quotes_text" "text",
    CONSTRAINT "ai_insights_flexible_parent_check" CHECK ((("document_id" IS NOT NULL) OR ("meeting_id" IS NOT NULL) OR (("document_id" IS NULL) AND ("meeting_id" IS NULL)))),
    CONSTRAINT "ai_insights_insight_type_check" CHECK (("insight_type" = ANY (ARRAY['action_item'::"text", 'decision'::"text", 'risk'::"text", 'milestone'::"text", 'fact'::"text", 'blocker'::"text", 'dependency'::"text", 'budget_update'::"text", 'timeline_change'::"text", 'stakeholder_feedback'::"text", 'technical_debt'::"text"]))),
    CONSTRAINT "ai_insights_severity_check" CHECK (("severity" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'critical'::"text"]))),
    CONSTRAINT "ai_insights_status_check" CHECK (("status" = ANY (ARRAY['open'::"text", 'in_progress'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."ai_insights" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."ai_insights_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."ai_insights_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."ai_insights_id_seq" OWNED BY "public"."ai_insights"."id";



ALTER TABLE "public"."ai_insights" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ai_insights_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE OR REPLACE VIEW "public"."ai_insights_today" WITH ("security_invoker"='on') AS
 SELECT "id",
    "project_id",
    "insight_type",
    "severity",
    "title",
    "description",
    "source_meetings",
    "confidence_score",
    "resolved",
    "created_at",
    "meeting_id",
    "meeting_name",
    "project_name",
    "document_id",
    "status",
    "assigned_to",
    "due_date",
    "metadata",
    "resolved_at",
    "business_impact",
    "assignee",
    "dependencies",
    "financial_impact",
    "timeline_impact_days",
    "stakeholders_affected",
    "exact_quotes",
    "numerical_data",
    "urgency_indicators",
    "cross_project_impact"
   FROM "public"."ai_insights"
  WHERE ((("created_at")::timestamp with time zone >= "date_trunc"('day'::"text", "now"())) AND (("created_at")::timestamp with time zone < ("date_trunc"('day'::"text", "now"()) + '1 day'::interval)));


ALTER VIEW "public"."ai_insights_today" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."ai_insights_with_project" AS
 SELECT "ai"."id",
    "ai"."project_id",
    "ai"."insight_type",
    "ai"."severity",
    "ai"."title",
    "ai"."description",
    "ai"."source_meetings",
    "ai"."confidence_score",
    "ai"."resolved",
    "ai"."created_at",
    "ai"."meeting_id",
    "p"."name" AS "project_name"
   FROM ("public"."ai_insights" "ai"
     LEFT JOIN "public"."projects" "p" ON (("ai"."project_id" = "p"."id")));


ALTER VIEW "public"."ai_insights_with_project" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_models" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "version" character varying(50) NOT NULL,
    "model_type" character varying(100) NOT NULL,
    "description" "text",
    "config" "jsonb",
    "performance_metrics" "jsonb",
    "is_active" boolean DEFAULT true,
    "deployment_date" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."ai_models" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" integer,
    "source_document_id" "text",
    "title" "text" NOT NULL,
    "description" "text",
    "assignee" "text",
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "due_date" "date",
    "created_by" "text" DEFAULT 'ai'::"text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ai_tasks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."app_users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" character varying(255) NOT NULL,
    "password_hash" character varying(255) NOT NULL,
    "full_name" character varying(255),
    "role" character varying(50) DEFAULT 'viewer'::character varying NOT NULL,
    "avatar_url" character varying(500),
    "email_verified" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "name" "text"
);


ALTER TABLE "public"."app_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."archon_code_examples" (
    "id" bigint NOT NULL,
    "url" character varying NOT NULL,
    "chunk_number" integer NOT NULL,
    "content" "text" NOT NULL,
    "summary" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "source_id" "text" NOT NULL,
    "embedding" "public"."vector"(1536),
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."archon_code_examples" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."archon_code_examples_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."archon_code_examples_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."archon_code_examples_id_seq" OWNED BY "public"."archon_code_examples"."id";



CREATE TABLE IF NOT EXISTS "public"."archon_crawled_pages" (
    "id" bigint NOT NULL,
    "url" character varying NOT NULL,
    "chunk_number" integer NOT NULL,
    "content" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "source_id" "text" NOT NULL,
    "embedding" "public"."vector"(1536),
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."archon_crawled_pages" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."archon_crawled_pages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."archon_crawled_pages_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."archon_crawled_pages_id_seq" OWNED BY "public"."archon_crawled_pages"."id";



CREATE TABLE IF NOT EXISTS "public"."archon_document_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "task_id" "uuid",
    "field_name" "text" NOT NULL,
    "version_number" integer NOT NULL,
    "content" "jsonb" NOT NULL,
    "change_summary" "text",
    "change_type" "text" DEFAULT 'update'::"text",
    "document_id" "text",
    "created_by" "text" DEFAULT 'system'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "chk_project_or_task" CHECK (((("project_id" IS NOT NULL) AND ("task_id" IS NULL)) OR (("project_id" IS NULL) AND ("task_id" IS NOT NULL))))
);


ALTER TABLE "public"."archon_document_versions" OWNER TO "postgres";


COMMENT ON TABLE "public"."archon_document_versions" IS 'Version control for JSONB fields in projects only - task versioning has been removed to simplify MCP operations';



COMMENT ON COLUMN "public"."archon_document_versions"."task_id" IS 'DEPRECATED: No longer used for new versions, kept for historical task version data';



COMMENT ON COLUMN "public"."archon_document_versions"."field_name" IS 'Name of JSONB field being versioned (docs, features, data) - task fields and prd removed as unused';



COMMENT ON COLUMN "public"."archon_document_versions"."content" IS 'Full snapshot of field content at this version';



COMMENT ON COLUMN "public"."archon_document_versions"."change_type" IS 'Type of change: create, update, delete, restore, backup';



COMMENT ON COLUMN "public"."archon_document_versions"."document_id" IS 'For docs arrays, the specific document ID that was changed';



CREATE TABLE IF NOT EXISTS "public"."archon_project_sources" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "source_id" "text" NOT NULL,
    "linked_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "text" DEFAULT 'system'::"text",
    "notes" "text"
);


ALTER TABLE "public"."archon_project_sources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."archon_projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" DEFAULT ''::"text",
    "docs" "jsonb" DEFAULT '[]'::"jsonb",
    "features" "jsonb" DEFAULT '[]'::"jsonb",
    "data" "jsonb" DEFAULT '[]'::"jsonb",
    "github_repo" "text",
    "pinned" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."archon_projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."archon_prompts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "prompt_name" "text" NOT NULL,
    "prompt" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."archon_prompts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."archon_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" character varying(255) NOT NULL,
    "value" "text",
    "encrypted_value" "text",
    "is_encrypted" boolean DEFAULT false,
    "category" character varying(100),
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."archon_settings" OWNER TO "postgres";


COMMENT ON TABLE "public"."archon_settings" IS 'Stores application configuration including API keys, RAG settings, and code extraction parameters';



CREATE TABLE IF NOT EXISTS "public"."archon_sources" (
    "source_id" "text" NOT NULL,
    "summary" "text",
    "total_word_count" integer DEFAULT 0,
    "title" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."archon_sources" OWNER TO "postgres";


COMMENT ON COLUMN "public"."archon_sources"."title" IS 'Descriptive title for the source (e.g., "Pydantic AI API Reference")';



COMMENT ON COLUMN "public"."archon_sources"."metadata" IS 'JSONB field storing knowledge_type, tags, and other metadata';



CREATE TABLE IF NOT EXISTS "public"."archon_tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "parent_task_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text" DEFAULT ''::"text",
    "status" "public"."task_status" DEFAULT 'todo'::"public"."task_status",
    "assignee" "text" DEFAULT 'User'::"text",
    "task_order" integer DEFAULT 0,
    "feature" "text",
    "sources" "jsonb" DEFAULT '[]'::"jsonb",
    "code_examples" "jsonb" DEFAULT '[]'::"jsonb",
    "archived" boolean DEFAULT false,
    "archived_at" timestamp with time zone,
    "archived_by" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "archon_tasks_assignee_check" CHECK ((("assignee" IS NOT NULL) AND ("assignee" <> ''::"text")))
);


ALTER TABLE "public"."archon_tasks" OWNER TO "postgres";


COMMENT ON COLUMN "public"."archon_tasks"."assignee" IS 'The agent or user assigned to this task. Can be any valid agent name or "User"';



COMMENT ON COLUMN "public"."archon_tasks"."archived" IS 'Soft delete flag - TRUE if task is archived/deleted';



COMMENT ON COLUMN "public"."archon_tasks"."archived_at" IS 'Timestamp when task was archived';



COMMENT ON COLUMN "public"."archon_tasks"."archived_by" IS 'User/system that archived the task';



CREATE TABLE IF NOT EXISTS "public"."asrs_blocks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "section_id" "uuid" NOT NULL,
    "ordinal" integer NOT NULL,
    "block_type" "text" NOT NULL,
    "source_text" "text",
    "html" "text",
    "meta" "jsonb" DEFAULT '{}'::"jsonb",
    CONSTRAINT "asrs_blocks_block_type_check" CHECK (("block_type" = ANY (ARRAY['paragraph'::"text", 'note'::"text", 'table'::"text", 'figure'::"text", 'equation'::"text", 'heading'::"text"])))
);


ALTER TABLE "public"."asrs_blocks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."asrs_configurations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "config_name" character varying(100) NOT NULL,
    "asrs_type" character varying(50) NOT NULL,
    "max_height_ft" numeric(5,2),
    "container_types" "text"[],
    "typical_applications" "text"[],
    "cost_multiplier" numeric(4,2) DEFAULT 1.0,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."asrs_configurations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."asrs_decision_matrix" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "asrs_type" "text" NOT NULL,
    "container_type" "text" NOT NULL,
    "max_depth_ft" double precision NOT NULL,
    "max_spacing_ft" double precision NOT NULL,
    "figure_number" integer NOT NULL,
    "sprinkler_count" integer NOT NULL,
    "sprinkler_numbering" "text",
    "page_number" integer NOT NULL,
    "title" "text",
    "requires_flue_spaces" boolean DEFAULT false,
    "requires_vertical_barriers" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."asrs_decision_matrix" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."asrs_logic_cards" (
    "id" bigint NOT NULL,
    "doc" "text" DEFAULT 'FMDS0834'::"text" NOT NULL,
    "version" "text" DEFAULT '2024-07'::"text" NOT NULL,
    "clause_id" "text",
    "page" integer,
    "purpose" "text" NOT NULL,
    "preconditions" "jsonb" NOT NULL,
    "inputs" "jsonb" NOT NULL,
    "decision" "jsonb" NOT NULL,
    "citations" "jsonb" NOT NULL,
    "related_table_ids" "text"[],
    "related_figure_ids" "text"[],
    "inserted_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "section_id" "uuid"
);


ALTER TABLE "public"."asrs_logic_cards" OWNER TO "postgres";


ALTER TABLE "public"."asrs_logic_cards" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."asrs_logic_cards_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."asrs_protection_rules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "section_id" "uuid" NOT NULL,
    "asrs_type" "text",
    "container_wall" "text",
    "container_material" "text",
    "container_top" "text",
    "commodity_class" "text",
    "ceiling_height_min" numeric,
    "ceiling_height_max" numeric,
    "sprinkler_scheme" "text",
    "k_factor" numeric,
    "density_gpm_ft2" numeric,
    "area_ft2" numeric,
    "pressure_psi" numeric,
    "notes" "text"
);


ALTER TABLE "public"."asrs_protection_rules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."asrs_sections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "number" "text" NOT NULL,
    "title" "text" NOT NULL,
    "parent_id" "uuid",
    "slug" "text" NOT NULL,
    "sort_key" integer NOT NULL
);


ALTER TABLE "public"."asrs_sections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."attachments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint,
    "attached_to_table" "text",
    "attached_to_id" "text",
    "file_name" "text",
    "url" "text",
    "uploaded_by" "uuid" DEFAULT "auth"."uid"(),
    "uploaded_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."attachments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."billing_periods" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" bigint,
    "period_number" integer NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "is_closed" boolean DEFAULT false,
    "closed_date" timestamp with time zone,
    "closed_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."billing_periods" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."block_embeddings" (
    "block_id" "uuid" NOT NULL,
    "embedding" "public"."vector"(1536)
);


ALTER TABLE "public"."block_embeddings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."briefing_runs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "briefing_id" "uuid",
    "project_id" bigint,
    "started_at" timestamp with time zone DEFAULT "now"(),
    "finished_at" timestamp with time zone,
    "status" "text",
    "token_usage" "jsonb",
    "input_doc_ids" "text"[],
    "error" "text"
);


ALTER TABLE "public"."briefing_runs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."budget_codes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint NOT NULL,
    "sub_job_id" "uuid",
    "cost_code_id" "text" NOT NULL,
    "cost_type_id" "uuid",
    "description" "text",
    "position" integer DEFAULT 999,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."budget_codes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."budget_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint NOT NULL,
    "cost_code_id" "text" NOT NULL,
    "cost_type" "text",
    "parent_cost_code" "text",
    "original_budget_amount" numeric(15,2) DEFAULT 0 NOT NULL,
    "budget_modifications" numeric(15,2) DEFAULT 0 NOT NULL,
    "approved_cos" numeric(15,2) DEFAULT 0 NOT NULL,
    "revised_budget" numeric(15,2) GENERATED ALWAYS AS (((COALESCE("original_budget_amount", (0)::numeric) + COALESCE("budget_modifications", (0)::numeric)) + COALESCE("approved_cos", (0)::numeric))) STORED,
    "committed_cost" numeric(15,2) DEFAULT 0,
    "direct_cost" numeric(15,2) DEFAULT 0,
    "pending_cost_changes" numeric(15,2) DEFAULT 0,
    "projected_cost" numeric(15,2) DEFAULT 0,
    "forecast_to_complete" numeric(15,2) DEFAULT 0,
    "original_amount" numeric(15,2),
    "unit_qty" numeric(12,4),
    "uom" "text",
    "unit_cost" numeric(15,4),
    "calculation_method" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "budget_code_id" "uuid",
    "sub_job_id" "uuid"
);


ALTER TABLE "public"."budget_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."budget_line_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "budget_code_id" "uuid" NOT NULL,
    "description" "text",
    "line_number" integer,
    "original_amount" numeric(15,2) DEFAULT 0,
    "unit_qty" numeric(15,3),
    "uom" character varying(50),
    "unit_cost" numeric(15,2),
    "calculation_method" character varying(50),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."budget_line_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."budget_modifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "budget_item_id" "uuid" NOT NULL,
    "amount" numeric(15,2) NOT NULL,
    "description" "text",
    "approved" boolean DEFAULT false NOT NULL,
    "approved_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."budget_modifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."budget_snapshots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint NOT NULL,
    "snapshot_name" character varying(255) NOT NULL,
    "snapshot_type" character varying(50) DEFAULT 'manual'::character varying,
    "description" "text",
    "line_items" "jsonb" NOT NULL,
    "grand_totals" "jsonb" NOT NULL,
    "project_metadata" "jsonb",
    "is_baseline" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    CONSTRAINT "budget_snapshots_snapshot_type_check" CHECK ((("snapshot_type")::"text" = ANY ((ARRAY['manual'::character varying, 'monthly'::character varying, 'milestone'::character varying, 'baseline'::character varying])::"text"[])))
);


ALTER TABLE "public"."budget_snapshots" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."change_event_line_items" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "change_event_id" bigint NOT NULL,
    "cost_code" "text",
    "description" "text",
    "quantity" numeric(14,2),
    "uom" "text",
    "unit_cost" numeric(14,2),
    "rom_amount" numeric(14,2),
    "final_amount" numeric(14,2)
);


ALTER TABLE "public"."change_event_line_items" OWNER TO "postgres";


ALTER TABLE "public"."change_event_line_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."change_event_line_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."change_events" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "project_id" bigint NOT NULL,
    "event_number" "text",
    "title" "text" NOT NULL,
    "reason" "text",
    "scope" "text",
    "status" "text",
    "notes" "text"
);


ALTER TABLE "public"."change_events" OWNER TO "postgres";


ALTER TABLE "public"."change_events" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."change_events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."change_order_approvals" (
    "id" bigint NOT NULL,
    "change_order_id" bigint NOT NULL,
    "approver" "uuid",
    "role" "text",
    "decision" "text",
    "comment" "text",
    "decided_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."change_order_approvals" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."change_order_approvals_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."change_order_approvals_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."change_order_approvals_id_seq" OWNED BY "public"."change_order_approvals"."id";



CREATE TABLE IF NOT EXISTS "public"."change_order_costs" (
    "id" bigint NOT NULL,
    "change_order_id" bigint NOT NULL,
    "labor" numeric DEFAULT 0,
    "materials" numeric DEFAULT 0,
    "subcontractor" numeric DEFAULT 0,
    "overhead" numeric DEFAULT 0,
    "contingency" numeric DEFAULT 0,
    "total_cost" numeric GENERATED ALWAYS AS ((((("labor" + "materials") + "subcontractor") + "overhead") + "contingency")) STORED,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."change_order_costs" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."change_order_costs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."change_order_costs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."change_order_costs_id_seq" OWNED BY "public"."change_order_costs"."id";



CREATE TABLE IF NOT EXISTS "public"."change_order_line_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "change_order_id" bigint NOT NULL,
    "budget_code_id" "uuid",
    "cost_code_id" "text",
    "description" "text" NOT NULL,
    "line_number" integer,
    "amount" numeric(15,2) DEFAULT 0 NOT NULL,
    "unit_qty" numeric(15,3),
    "uom" character varying(50),
    "unit_cost" numeric(15,2),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."change_order_line_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."change_order_lines" (
    "id" bigint NOT NULL,
    "change_order_id" bigint NOT NULL,
    "project_id" bigint NOT NULL,
    "description" "text",
    "related_qto_item_id" bigint,
    "quantity" numeric DEFAULT 0,
    "unit" "text",
    "unit_cost" numeric DEFAULT 0,
    "line_total" numeric GENERATED ALWAYS AS (("quantity" * "unit_cost")) STORED,
    "cost_type" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."change_order_lines" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."change_order_lines_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."change_order_lines_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."change_order_lines_id_seq" OWNED BY "public"."change_order_lines"."id";



CREATE TABLE IF NOT EXISTS "public"."change_orders" (
    "id" bigint NOT NULL,
    "project_id" bigint NOT NULL,
    "co_number" "text",
    "title" "text",
    "description" "text",
    "status" "text" DEFAULT 'proposed'::"text",
    "submitted_by" "uuid" DEFAULT "auth"."uid"(),
    "submitted_at" timestamp with time zone,
    "approved_by" "uuid",
    "approved_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "apply_vertical_markup" boolean DEFAULT true
);


ALTER TABLE "public"."change_orders" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."change_orders_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."change_orders_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."change_orders_id_seq" OWNED BY "public"."change_orders"."id";



CREATE TABLE IF NOT EXISTS "public"."chat_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "role" "text" NOT NULL,
    "content" "text" NOT NULL,
    "sources" "jsonb" DEFAULT '[]'::"jsonb",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "chat_history_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'assistant'::"text", 'system'::"text"])))
);


ALTER TABLE "public"."chat_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid",
    "role" "text" NOT NULL,
    "content" "text" NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "chat_messages_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'assistant'::"text", 'system'::"text"])))
);


ALTER TABLE "public"."chat_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "title" "text",
    "context" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."chat_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_thread_attachment_files" (
    "attachment_id" "text" NOT NULL,
    "storage_path" "text" NOT NULL,
    "thread_id" "text",
    "filename" "text",
    "mime_type" "text",
    "size_bytes" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chat_thread_attachment_files" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_thread_attachments" (
    "id" "text" NOT NULL,
    "thread_id" "text",
    "filename" "text",
    "mime_type" "text",
    "payload" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chat_thread_attachments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_thread_feedback" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "thread_id" "text" NOT NULL,
    "item_ids" "text"[] NOT NULL,
    "feedback" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chat_thread_feedback" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_thread_items" (
    "id" "text" NOT NULL,
    "thread_id" "text" NOT NULL,
    "item_type" "text" NOT NULL,
    "payload" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chat_thread_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_threads" (
    "id" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chat_threads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chats" (
    "id" character varying NOT NULL
);


ALTER TABLE "public"."chats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chunks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "document_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "embedding" "public"."vector"(1536),
    "chunk_index" integer NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "token_count" integer,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "document_title" "text"
);


ALTER TABLE "public"."chunks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."clients" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "company_id" "uuid",
    "status" "text",
    "code" "text"
);


ALTER TABLE "public"."clients" OWNER TO "postgres";


ALTER TABLE "public"."clients" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."clients_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."code_examples" (
    "id" bigint NOT NULL,
    "url" character varying NOT NULL,
    "chunk_number" integer NOT NULL,
    "content" "text" NOT NULL,
    "summary" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "source_id" "text" NOT NULL,
    "embedding" "public"."vector"(1536),
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."code_examples" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."code_examples_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."code_examples_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."code_examples_id_seq" OWNED BY "public"."code_examples"."id";



CREATE TABLE IF NOT EXISTS "public"."commitment_changes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "commitment_id" "uuid" NOT NULL,
    "budget_item_id" "uuid" NOT NULL,
    "amount" numeric(14,2) NOT NULL,
    "status" "text",
    "approved_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "commitment_changes_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'pending'::"text", 'approved'::"text", 'void'::"text"])))
);


ALTER TABLE "public"."commitment_changes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."commitments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint NOT NULL,
    "budget_item_id" "uuid" NOT NULL,
    "vendor_id" "uuid",
    "contract_amount" numeric(14,2) NOT NULL,
    "status" "text",
    "executed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "retention_percentage" numeric(5,2) DEFAULT 0,
    CONSTRAINT "commitments_retention_percentage_check" CHECK ((("retention_percentage" >= (0)::numeric) AND ("retention_percentage" <= (100)::numeric))),
    CONSTRAINT "commitments_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'pending'::"text", 'executed'::"text", 'closed'::"text", 'approved'::"text"])))
);


ALTER TABLE "public"."commitments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."companies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "website" "text",
    "address" "text",
    "state" "text",
    "city" "text",
    "title" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "currency_symbol" character varying(10) DEFAULT '$'::character varying,
    "currency_code" character varying(3) DEFAULT 'USD'::character varying
);


ALTER TABLE "public"."companies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_context" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "goals" "jsonb" DEFAULT '[]'::"jsonb",
    "strategic_initiatives" "jsonb" DEFAULT '[]'::"jsonb",
    "okrs" "jsonb" DEFAULT '[]'::"jsonb",
    "resource_constraints" "jsonb" DEFAULT '[]'::"jsonb",
    "policies" "jsonb" DEFAULT '[]'::"jsonb",
    "org_structure" "jsonb",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."company_context" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contacts" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text",
    "phone" "text",
    "birthday" "text",
    "notes" "text",
    "job_title" "text",
    "department" "text",
    "projects" "text"[] DEFAULT '{}'::"text"[],
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "address" "text",
    "city" "text",
    "state" "text",
    "zip" "text",
    "country" "text",
    "type" "text",
    "company_id" "uuid",
    "company_name" "text"
);


ALTER TABLE "public"."contacts" OWNER TO "postgres";


COMMENT ON TABLE "public"."contacts" IS 'CRM';



ALTER TABLE "public"."contacts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."contacts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."contracts" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "project_id" bigint NOT NULL,
    "client_id" bigint NOT NULL,
    "contract_number" "text",
    "title" "text" NOT NULL,
    "status" "text",
    "erp_status" "text",
    "executed" boolean DEFAULT false,
    "original_contract_amount" numeric(14,2) DEFAULT 0,
    "approved_change_orders" numeric(14,2) DEFAULT 0,
    "revised_contract_amount" numeric(14,2) DEFAULT 0,
    "pending_change_orders" numeric(14,2) DEFAULT 0,
    "draft_change_orders" numeric(14,2) DEFAULT 0,
    "invoiced_amount" numeric(14,2) DEFAULT 0,
    "payments_received" numeric(14,2) DEFAULT 0,
    "percent_paid" numeric(6,2) GENERATED ALWAYS AS (
CASE
    WHEN ("revised_contract_amount" > (0)::numeric) THEN (("payments_received" / "revised_contract_amount") * (100)::numeric)
    ELSE (0)::numeric
END) STORED,
    "remaining_balance" numeric(14,2) DEFAULT 0,
    "private" boolean DEFAULT false,
    "attachment_count" integer DEFAULT 0,
    "notes" "text",
    "retention_percentage" numeric(5,2) DEFAULT 0,
    "apply_vertical_markup" boolean DEFAULT true,
    CONSTRAINT "contracts_retention_percentage_check" CHECK ((("retention_percentage" >= (0)::numeric) AND ("retention_percentage" <= (100)::numeric)))
);


ALTER TABLE "public"."contracts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."owner_invoice_line_items" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "invoice_id" bigint NOT NULL,
    "description" "text",
    "category" "text",
    "approved_amount" numeric(14,2)
);


ALTER TABLE "public"."owner_invoice_line_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."owner_invoices" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "contract_id" bigint NOT NULL,
    "invoice_number" "text",
    "period_start" "date",
    "period_end" "date",
    "status" "text",
    "submitted_at" timestamp with time zone,
    "approved_at" timestamp with time zone,
    "billing_period_id" "uuid"
);


ALTER TABLE "public"."owner_invoices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_transactions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "contract_id" bigint NOT NULL,
    "invoice_id" bigint,
    "payment_date" "date" NOT NULL,
    "amount" numeric(14,2) NOT NULL,
    "method" "text",
    "reference_number" "text"
);


ALTER TABLE "public"."payment_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pcco_line_items" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "pcco_id" bigint NOT NULL,
    "pco_id" bigint,
    "cost_code" "text",
    "description" "text",
    "quantity" numeric(14,2),
    "uom" "text",
    "unit_cost" numeric(14,2),
    "line_amount" numeric(14,2) GENERATED ALWAYS AS (("quantity" * "unit_cost")) STORED
);


ALTER TABLE "public"."pcco_line_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pco_line_items" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "pco_id" bigint NOT NULL,
    "change_event_line_item_id" bigint,
    "cost_code" "text",
    "description" "text",
    "quantity" numeric(14,2),
    "uom" "text",
    "unit_cost" numeric(14,2),
    "line_amount" numeric(14,2) GENERATED ALWAYS AS (("quantity" * "unit_cost")) STORED
);


ALTER TABLE "public"."pco_line_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."prime_contract_change_orders" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "contract_id" bigint NOT NULL,
    "pcco_number" "text",
    "title" "text" NOT NULL,
    "status" "text",
    "executed" boolean DEFAULT false,
    "submitted_at" timestamp with time zone,
    "approved_at" timestamp with time zone,
    "total_amount" numeric(14,2)
);


ALTER TABLE "public"."prime_contract_change_orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."prime_contract_sovs" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "contract_id" bigint NOT NULL,
    "cost_code" "text",
    "description" "text",
    "quantity" numeric(14,2) DEFAULT 1,
    "uom" "text",
    "unit_cost" numeric(14,2) DEFAULT 0,
    "line_amount" numeric(14,2) GENERATED ALWAYS AS (("quantity" * "unit_cost")) STORED,
    "sort_order" integer DEFAULT 0
);


ALTER TABLE "public"."prime_contract_sovs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."prime_potential_change_orders" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "project_id" bigint NOT NULL,
    "contract_id" bigint NOT NULL,
    "change_event_id" bigint,
    "pco_number" "text",
    "title" "text" NOT NULL,
    "status" "text",
    "reason" "text",
    "scope" "text",
    "submitted_at" timestamp with time zone,
    "approved_at" timestamp with time zone,
    "notes" "text"
);


ALTER TABLE "public"."prime_potential_change_orders" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."contract_financial_summary" AS
 WITH "original_sov" AS (
         SELECT "prime_contract_sovs"."contract_id",
            COALESCE("sum"("prime_contract_sovs"."line_amount"), (0)::numeric) AS "original_contract_amount"
           FROM "public"."prime_contract_sovs"
          GROUP BY "prime_contract_sovs"."contract_id"
        ), "approved_pccos" AS (
         SELECT "prime_contract_change_orders"."contract_id",
            COALESCE("sum"("pcco_line_items"."line_amount"), (0)::numeric) AS "approved_change_orders"
           FROM ("public"."prime_contract_change_orders"
             JOIN "public"."pcco_line_items" ON (("pcco_line_items"."pcco_id" = "prime_contract_change_orders"."id")))
          WHERE ("prime_contract_change_orders"."status" = 'Approved'::"text")
          GROUP BY "prime_contract_change_orders"."contract_id"
        ), "pending_pcos" AS (
         SELECT "prime_potential_change_orders"."contract_id",
            COALESCE("sum"("pco_line_items"."line_amount"), (0)::numeric) AS "pending_change_orders"
           FROM ("public"."prime_potential_change_orders"
             JOIN "public"."pco_line_items" ON (("pco_line_items"."pco_id" = "prime_potential_change_orders"."id")))
          WHERE ("prime_potential_change_orders"."status" = 'Pending'::"text")
          GROUP BY "prime_potential_change_orders"."contract_id"
        ), "draft_pcos" AS (
         SELECT "prime_potential_change_orders"."contract_id",
            COALESCE("sum"("pco_line_items"."line_amount"), (0)::numeric) AS "draft_change_orders"
           FROM ("public"."prime_potential_change_orders"
             JOIN "public"."pco_line_items" ON (("pco_line_items"."pco_id" = "prime_potential_change_orders"."id")))
          WHERE ("prime_potential_change_orders"."status" = 'Draft'::"text")
          GROUP BY "prime_potential_change_orders"."contract_id"
        ), "invoiced" AS (
         SELECT "owner_invoices"."contract_id",
            COALESCE("sum"("owner_invoice_line_items"."approved_amount"), (0)::numeric) AS "invoiced_amount"
           FROM ("public"."owner_invoices"
             JOIN "public"."owner_invoice_line_items" ON (("owner_invoice_line_items"."invoice_id" = "owner_invoices"."id")))
          WHERE ("owner_invoices"."status" = 'Approved'::"text")
          GROUP BY "owner_invoices"."contract_id"
        ), "payments" AS (
         SELECT "payment_transactions"."contract_id",
            COALESCE("sum"("payment_transactions"."amount"), (0)::numeric) AS "payments_received"
           FROM "public"."payment_transactions"
          GROUP BY "payment_transactions"."contract_id"
        )
 SELECT "c"."id" AS "contract_id",
    "c"."contract_number",
    "c"."client_id",
    "c"."title",
    "c"."status",
    "c"."erp_status",
    "c"."executed",
    "c"."private",
    "os"."original_contract_amount",
    "ap"."approved_change_orders",
    ("os"."original_contract_amount" + "ap"."approved_change_orders") AS "revised_contract_amount",
    "pp"."pending_change_orders",
    "dp"."draft_change_orders",
    "inv"."invoiced_amount",
    "pay"."payments_received",
        CASE
            WHEN (("os"."original_contract_amount" + "ap"."approved_change_orders") > (0)::numeric) THEN "round"((("pay"."payments_received" / ("os"."original_contract_amount" + "ap"."approved_change_orders")) * (100)::numeric), 2)
            ELSE (0)::numeric
        END AS "percent_paid",
    (("os"."original_contract_amount" + "ap"."approved_change_orders") - "pay"."payments_received") AS "remaining_balance"
   FROM (((((("public"."contracts" "c"
     LEFT JOIN "original_sov" "os" ON (("os"."contract_id" = "c"."id")))
     LEFT JOIN "approved_pccos" "ap" ON (("ap"."contract_id" = "c"."id")))
     LEFT JOIN "pending_pcos" "pp" ON (("pp"."contract_id" = "c"."id")))
     LEFT JOIN "draft_pcos" "dp" ON (("dp"."contract_id" = "c"."id")))
     LEFT JOIN "invoiced" "inv" ON (("inv"."contract_id" = "c"."id")))
     LEFT JOIN "payments" "pay" ON (("pay"."contract_id" = "c"."id")));


ALTER VIEW "public"."contract_financial_summary" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."contract_financial_summary_mv" AS
 WITH "original_sov" AS (
         SELECT "prime_contract_sovs"."contract_id",
            COALESCE("sum"("prime_contract_sovs"."line_amount"), (0)::numeric) AS "original_contract_amount"
           FROM "public"."prime_contract_sovs"
          GROUP BY "prime_contract_sovs"."contract_id"
        ), "approved_pccos" AS (
         SELECT "prime_contract_change_orders"."contract_id",
            COALESCE("sum"("pcco_line_items"."line_amount"), (0)::numeric) AS "approved_change_orders"
           FROM ("public"."prime_contract_change_orders"
             JOIN "public"."pcco_line_items" ON (("pcco_line_items"."pcco_id" = "prime_contract_change_orders"."id")))
          WHERE ("prime_contract_change_orders"."status" = 'Approved'::"text")
          GROUP BY "prime_contract_change_orders"."contract_id"
        ), "pending_pcos" AS (
         SELECT "prime_potential_change_orders"."contract_id",
            COALESCE("sum"("pco_line_items"."line_amount"), (0)::numeric) AS "pending_change_orders"
           FROM ("public"."prime_potential_change_orders"
             JOIN "public"."pco_line_items" ON (("pco_line_items"."pco_id" = "prime_potential_change_orders"."id")))
          WHERE ("prime_potential_change_orders"."status" = 'Pending'::"text")
          GROUP BY "prime_potential_change_orders"."contract_id"
        ), "draft_pcos" AS (
         SELECT "prime_potential_change_orders"."contract_id",
            COALESCE("sum"("pco_line_items"."line_amount"), (0)::numeric) AS "draft_change_orders"
           FROM ("public"."prime_potential_change_orders"
             JOIN "public"."pco_line_items" ON (("pco_line_items"."pco_id" = "prime_potential_change_orders"."id")))
          WHERE ("prime_potential_change_orders"."status" = 'Draft'::"text")
          GROUP BY "prime_potential_change_orders"."contract_id"
        ), "invoiced" AS (
         SELECT "owner_invoices"."contract_id",
            COALESCE("sum"("owner_invoice_line_items"."approved_amount"), (0)::numeric) AS "invoiced_amount"
           FROM ("public"."owner_invoices"
             JOIN "public"."owner_invoice_line_items" ON (("owner_invoice_line_items"."invoice_id" = "owner_invoices"."id")))
          WHERE ("owner_invoices"."status" = 'Approved'::"text")
          GROUP BY "owner_invoices"."contract_id"
        ), "payments" AS (
         SELECT "payment_transactions"."contract_id",
            COALESCE("sum"("payment_transactions"."amount"), (0)::numeric) AS "payments_received"
           FROM "public"."payment_transactions"
          GROUP BY "payment_transactions"."contract_id"
        )
 SELECT "c"."id" AS "contract_id",
    "c"."contract_number",
    "c"."client_id",
    "c"."project_id",
    "c"."title",
    "c"."status",
    "c"."erp_status",
    "c"."executed",
    "c"."private",
    COALESCE("os"."original_contract_amount", (0)::numeric) AS "original_contract_amount",
    COALESCE("ap"."approved_change_orders", (0)::numeric) AS "approved_change_orders",
    (COALESCE("os"."original_contract_amount", (0)::numeric) + COALESCE("ap"."approved_change_orders", (0)::numeric)) AS "revised_contract_amount",
    COALESCE("pp"."pending_change_orders", (0)::numeric) AS "pending_change_orders",
    COALESCE("dp"."draft_change_orders", (0)::numeric) AS "draft_change_orders",
    COALESCE("inv"."invoiced_amount", (0)::numeric) AS "invoiced_amount",
    COALESCE("pay"."payments_received", (0)::numeric) AS "payments_received",
        CASE
            WHEN ((COALESCE("os"."original_contract_amount", (0)::numeric) + COALESCE("ap"."approved_change_orders", (0)::numeric)) > (0)::numeric) THEN "round"(((COALESCE("pay"."payments_received", (0)::numeric) / (COALESCE("os"."original_contract_amount", (0)::numeric) + COALESCE("ap"."approved_change_orders", (0)::numeric))) * (100)::numeric), 2)
            ELSE (0)::numeric
        END AS "percent_paid",
    ((COALESCE("os"."original_contract_amount", (0)::numeric) + COALESCE("ap"."approved_change_orders", (0)::numeric)) - COALESCE("pay"."payments_received", (0)::numeric)) AS "remaining_balance"
   FROM (((((("public"."contracts" "c"
     LEFT JOIN "original_sov" "os" ON (("os"."contract_id" = "c"."id")))
     LEFT JOIN "approved_pccos" "ap" ON (("ap"."contract_id" = "c"."id")))
     LEFT JOIN "pending_pcos" "pp" ON (("pp"."contract_id" = "c"."id")))
     LEFT JOIN "draft_pcos" "dp" ON (("dp"."contract_id" = "c"."id")))
     LEFT JOIN "invoiced" "inv" ON (("inv"."contract_id" = "c"."id")))
     LEFT JOIN "payments" "pay" ON (("pay"."contract_id" = "c"."id")))
  WITH NO DATA;


ALTER MATERIALIZED VIEW "public"."contract_financial_summary_mv" OWNER TO "postgres";


ALTER TABLE "public"."contracts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."contracts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."conversations" (
    "session_id" character varying NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "last_message_at" timestamp with time zone DEFAULT "now"(),
    "is_archived" boolean DEFAULT false,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."issues" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "project_id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "category" "public"."issue_category" NOT NULL,
    "severity" "public"."issue_severity" DEFAULT 'Medium'::"public"."issue_severity",
    "status" "public"."issue_status" DEFAULT 'Open'::"public"."issue_status",
    "reported_by" "text",
    "date_reported" "date" DEFAULT CURRENT_DATE,
    "date_resolved" "date",
    "direct_cost" numeric(12,2) DEFAULT 0,
    "indirect_cost" numeric(12,2) DEFAULT 0,
    "total_cost" numeric(12,2) GENERATED ALWAYS AS (("direct_cost" + "indirect_cost")) STORED,
    "notes" "text"
);


ALTER TABLE "public"."issues" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."cost_by_category" AS
 SELECT "category",
    "count"(*) AS "issue_count",
    "sum"("total_cost") AS "total_cost",
    "round"("avg"("total_cost"), 2) AS "avg_cost"
   FROM "public"."issues"
  GROUP BY "category"
  ORDER BY ("sum"("total_cost")) DESC NULLS LAST;


ALTER VIEW "public"."cost_by_category" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cost_code_division_updates_audit" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "division_id" "uuid" NOT NULL,
    "new_title" "text",
    "updated_count" integer,
    "changed_at" timestamp with time zone DEFAULT "now"(),
    "changed_by" "text"
);


ALTER TABLE "public"."cost_code_division_updates_audit" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cost_code_divisions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "title" "text" NOT NULL,
    "sort_order" integer NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text"
);


ALTER TABLE "public"."cost_code_divisions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cost_code_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "description" "text" NOT NULL,
    "category" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cost_code_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cost_codes" (
    "id" "text" NOT NULL,
    "division_id" "uuid" NOT NULL,
    "division_title" "text",
    "description" "text",
    "status" "text" DEFAULT 'True'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cost_codes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cost_factors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "factor_name" character varying(100) NOT NULL,
    "factor_type" character varying(50) NOT NULL,
    "base_cost_per_unit" numeric(10,2),
    "unit_type" character varying(50),
    "complexity_multiplier" numeric(4,2) DEFAULT 1.0,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."cost_factors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cost_forecasts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "budget_item_id" "uuid",
    "forecast_date" "date" NOT NULL,
    "forecast_to_complete" numeric(15,2) NOT NULL,
    "notes" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cost_forecasts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."crawled_pages" (
    "id" bigint NOT NULL,
    "url" character varying NOT NULL,
    "chunk_number" integer NOT NULL,
    "content" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "source_id" "text" NOT NULL,
    "embedding" "public"."vector"(1536),
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."crawled_pages" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."crawled_pages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."crawled_pages_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."crawled_pages_id_seq" OWNED BY "public"."crawled_pages"."id";



CREATE TABLE IF NOT EXISTS "public"."daily_log_equipment" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "daily_log_id" "uuid",
    "equipment_name" character varying(255) NOT NULL,
    "hours_operated" numeric(5,2),
    "hours_idle" numeric(5,2),
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."daily_log_equipment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."daily_log_manpower" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "daily_log_id" "uuid",
    "company_id" "uuid",
    "trade" character varying(100),
    "workers_count" integer NOT NULL,
    "hours_worked" numeric(5,2),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."daily_log_manpower" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."daily_log_notes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "daily_log_id" "uuid",
    "category" character varying(100),
    "description" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."daily_log_notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."daily_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" bigint,
    "log_date" "date" NOT NULL,
    "weather_conditions" "jsonb",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."daily_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."daily_recaps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "recap_date" "date" NOT NULL,
    "date_range_start" "date" NOT NULL,
    "date_range_end" "date" NOT NULL,
    "recap_text" "text" NOT NULL,
    "recap_html" "text",
    "meeting_count" integer,
    "project_count" integer,
    "meetings_analyzed" "jsonb",
    "risks" "jsonb",
    "decisions" "jsonb",
    "blockers" "jsonb",
    "commitments" "jsonb",
    "wins" "jsonb",
    "sent_email" boolean DEFAULT false,
    "sent_teams" boolean DEFAULT false,
    "sent_at" timestamp with time zone,
    "recipients" "jsonb",
    "generation_time_seconds" double precision,
    "model_used" character varying(50) DEFAULT 'gpt-4o'::character varying
);


ALTER TABLE "public"."daily_recaps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."decisions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "metadata_id" "text" NOT NULL,
    "segment_id" "uuid",
    "source_chunk_id" "uuid",
    "description" "text" NOT NULL,
    "rationale" "text",
    "owner_name" "text",
    "owner_email" "text",
    "project_id" bigint,
    "client_id" bigint,
    "effective_date" "date",
    "impact" "text",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "embedding" "public"."vector"(1536),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "project_ids" integer[] DEFAULT '{}'::integer[],
    CONSTRAINT "decisions_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'superseded'::"text", 'reversed'::"text"])))
);


ALTER TABLE "public"."decisions" OWNER TO "postgres";


COMMENT ON COLUMN "public"."decisions"."project_ids" IS 'Array of project IDs this decision relates to. Allows decisions to span multiple projects.';



CREATE TABLE IF NOT EXISTS "public"."design_recommendations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "recommendation_type" character varying(100) NOT NULL,
    "description" "text" NOT NULL,
    "potential_savings" numeric(12,2),
    "priority_level" character varying(20) NOT NULL,
    "implementation_effort" character varying(20),
    "technical_details" "jsonb",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."design_recommendations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."direct_cost_line_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint NOT NULL,
    "budget_code_id" "uuid",
    "cost_code_id" "text",
    "description" "text" NOT NULL,
    "transaction_date" "date" NOT NULL,
    "vendor_name" character varying(255),
    "invoice_number" character varying(100),
    "amount" numeric(15,2) DEFAULT 0 NOT NULL,
    "approved" boolean DEFAULT false,
    "approved_at" timestamp with time zone,
    "approved_by" "uuid",
    "cost_type" character varying(50),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."direct_cost_line_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."direct_costs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint NOT NULL,
    "budget_item_id" "uuid" NOT NULL,
    "vendor_id" "uuid",
    "description" "text",
    "cost_type" "text",
    "amount" numeric(14,2) NOT NULL,
    "incurred_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."direct_costs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."discrepancies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "submittal_id" "uuid" NOT NULL,
    "specification_id" "uuid",
    "document_id" "uuid",
    "discrepancy_type" character varying(100) NOT NULL,
    "severity" character varying(50) NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "spec_requirement" "text",
    "submittal_content" "text",
    "suggested_resolution" "text",
    "confidence_score" numeric(3,2),
    "location_in_doc" "jsonb",
    "status" character varying(50) DEFAULT 'open'::character varying,
    "identified_by" character varying(50) DEFAULT 'ai'::character varying,
    "ai_model_version" character varying(50),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "discrepancies_severity_check" CHECK ((("severity")::"text" = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying])::"text"[]))),
    CONSTRAINT "discrepancies_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['open'::character varying, 'acknowledged'::character varying, 'resolved'::character varying, 'waived'::character varying, 'disputed'::character varying])::"text"[])))
);


ALTER TABLE "public"."discrepancies" OWNER TO "postgres";


COMMENT ON TABLE "public"."discrepancies" IS 'AI-detected discrepancies between specifications and submittals';



CREATE TABLE IF NOT EXISTS "public"."document_chunks" (
    "chunk_id" "text" NOT NULL,
    "document_id" "text" NOT NULL,
    "chunk_index" integer NOT NULL,
    "text" "text" NOT NULL,
    "metadata" "jsonb",
    "content_hash" "text",
    "embedding" "public"."vector"(1536),
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."document_chunks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."document_executive_summaries" (
    "id" integer NOT NULL,
    "document_id" "uuid" NOT NULL,
    "project_id" integer,
    "executive_summary" "text" NOT NULL,
    "critical_path_items" integer DEFAULT 0,
    "total_insights" integer DEFAULT 0,
    "confidence_average" numeric(3,2) DEFAULT 0.0,
    "budget_discussions" "jsonb" DEFAULT '[]'::"jsonb",
    "cost_implications" numeric,
    "revenue_impact" numeric,
    "financial_decisions_count" integer DEFAULT 0,
    "delay_risks" "jsonb" DEFAULT '[]'::"jsonb",
    "critical_deadlines" "jsonb" DEFAULT '[]'::"jsonb",
    "timeline_concerns_count" integer DEFAULT 0,
    "relationship_changes" "jsonb" DEFAULT '[]'::"jsonb",
    "performance_issues" "jsonb" DEFAULT '[]'::"jsonb",
    "stakeholder_feedback_count" integer DEFAULT 0,
    "decisions_made" "jsonb" DEFAULT '[]'::"jsonb",
    "competitive_intel" "jsonb" DEFAULT '[]'::"jsonb",
    "strategic_pivots" "jsonb" DEFAULT '[]'::"jsonb",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."document_executive_summaries" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."document_executive_summaries_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."document_executive_summaries_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."document_executive_summaries_id_seq" OWNED BY "public"."document_executive_summaries"."id";



CREATE TABLE IF NOT EXISTS "public"."document_group_access" (
    "document_id" "text" NOT NULL,
    "group_id" "uuid" NOT NULL,
    "access_level" "text" DEFAULT 'viewer'::"text" NOT NULL
);


ALTER TABLE "public"."document_group_access" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."document_metadata_manual_only" AS
 SELECT "id",
    "title",
    "url",
    "created_at",
    "type",
    "source",
    "content",
    "summary",
    "participants",
    "tags",
    "category",
    "fireflies_id",
    "fireflies_link",
    "project_id",
    "project",
    "date",
    "duration_minutes",
    "bullet_points",
    "action_items",
    "file_id",
    "overview",
    "description",
    "status",
    "access_level",
    "captured_at",
    "content_hash",
    "participants_array",
    "phase",
    "audio",
    "video"
   FROM "public"."document_metadata"
  WHERE ("fireflies_id" ~~* '%MANUAL%'::"text");


ALTER VIEW "public"."document_metadata_manual_only" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."document_metadata_view_no_summary" WITH ("security_invoker"='on') AS
 SELECT "title",
    "date",
    "project_id",
    "project",
    "fireflies_id",
    "fireflies_link"
   FROM "public"."document_metadata";


ALTER VIEW "public"."document_metadata_view_no_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."document_rows" (
    "id" integer NOT NULL,
    "dataset_id" "text",
    "row_data" "jsonb"
);


ALTER TABLE "public"."document_rows" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."document_rows_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."document_rows_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."document_rows_id_seq" OWNED BY "public"."document_rows"."id";



CREATE TABLE IF NOT EXISTS "public"."document_user_access" (
    "document_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "access_level" "text" DEFAULT 'viewer'::"text" NOT NULL
);


ALTER TABLE "public"."document_user_access" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text",
    "source" "text",
    "content" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "file_id" "text" NOT NULL,
    "fireflies_id" "text",
    "processing_status" character varying(20) DEFAULT 'pending'::character varying,
    "project_id" bigint,
    "project" "text",
    "file_date" timestamp with time zone,
    "embedding" "public"."vector",
    "url" "text",
    "storage_object_id" "uuid",
    "project_ids" integer[] DEFAULT '{}'::integer[]
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


COMMENT ON COLUMN "public"."documents"."project_id" IS 'Used to link the associated project.';



COMMENT ON COLUMN "public"."documents"."project_ids" IS 'Array of project IDs for this chunk. Inherited from meeting_segments.project_ids.';



CREATE OR REPLACE VIEW "public"."documents_ordered_view" WITH ("security_invoker"='on') AS
 SELECT "id",
    "title",
    "file_date" AS "date",
    "project_id",
    "project",
    "fireflies_id",
    "created_at",
    "updated_at"
   FROM "public"."documents";


ALTER VIEW "public"."documents_ordered_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employees" (
    "id" bigint NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text",
    "phone" "text",
    "department" "text",
    "salery" "text",
    "start_date" "date",
    "supervisor" bigint,
    "company_card" numeric,
    "truck_allowance" numeric,
    "phone_allowance" numeric,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "job_title" "text",
    "supervisor_name" "text",
    "photo" "text"
);


ALTER TABLE "public"."employees" OWNER TO "postgres";


ALTER TABLE "public"."employees" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."employees_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."erp_sync_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint NOT NULL,
    "erp_system" "text",
    "last_job_cost_sync" timestamp with time zone,
    "last_direct_cost_sync" timestamp with time zone,
    "sync_status" "text",
    "payload" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."erp_sync_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fm_global_figures" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "figure_number" integer NOT NULL,
    "title" "text" NOT NULL,
    "clean_caption" "text" NOT NULL,
    "normalized_summary" "text" NOT NULL,
    "figure_type" "text" NOT NULL,
    "asrs_type" "text" NOT NULL,
    "container_type" "text",
    "max_depth_ft" numeric,
    "max_depth_m" numeric,
    "max_spacing_ft" numeric,
    "max_spacing_m" numeric,
    "ceiling_height_ft" numeric,
    "aisle_width_ft" numeric,
    "related_tables" integer[],
    "applicable_commodities" "text"[],
    "system_requirements" "jsonb",
    "special_conditions" "text"[],
    "machine_readable_claims" "jsonb",
    "callouts_labels" "text"[],
    "axis_titles" "text"[],
    "axis_units" "text"[],
    "embedded_tables" "jsonb",
    "footnotes" "text"[],
    "page_number" integer,
    "section_reference" "text",
    "embedding" "public"."vector"(1536),
    "search_keywords" "text"[],
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "section_references" "text"[],
    "image" "text",
    CONSTRAINT "fm_global_figures_asrs_type_check" CHECK (("asrs_type" = ANY (ARRAY['All'::"text", 'Shuttle'::"text", 'Mini-Load'::"text", 'Top-Loading'::"text", 'Vertically-Enclosed'::"text"]))),
    CONSTRAINT "fm_global_figures_container_type_check" CHECK (("container_type" = ANY (ARRAY['Closed-Top'::"text", 'Open-Top'::"text", 'Noncombustible'::"text", 'Plastic'::"text", 'Mixed'::"text"]))),
    CONSTRAINT "fm_global_figures_figure_type_check" CHECK (("figure_type" = ANY (ARRAY['Navigation/Decision Tree'::"text", 'System Diagram'::"text", 'Sprinkler Layout'::"text", 'Protection Scheme'::"text", 'Configuration'::"text", 'Installation Detail'::"text", 'Special Arrangement'::"text"])))
);


ALTER TABLE "public"."fm_global_figures" OWNER TO "postgres";


COMMENT ON TABLE "public"."fm_global_figures" IS 'Complete FM Global 8-34 figures database optimized for RAG applications. Contains all sprinkler arrangement diagrams, system schematics, and decision trees.';



COMMENT ON COLUMN "public"."fm_global_figures"."normalized_summary" IS 'Human-readable summary optimized for semantic search and AI understanding, focusing on practical applications';



COMMENT ON COLUMN "public"."fm_global_figures"."machine_readable_claims" IS 'JSON snippets containing key technical specifications for programmatic use in form generation and requirements calculation';



CREATE OR REPLACE VIEW "public"."figure_statistics" AS
 SELECT 'Total Figures'::"text" AS "metric",
    ("count"(*))::"text" AS "value"
   FROM "public"."fm_global_figures"
UNION ALL
 SELECT 'Shuttle ASRS Figures'::"text" AS "metric",
    ("count"(*))::"text" AS "value"
   FROM "public"."fm_global_figures"
  WHERE ("fm_global_figures"."asrs_type" = 'Shuttle'::"text")
UNION ALL
 SELECT 'Mini-Load ASRS Figures'::"text" AS "metric",
    ("count"(*))::"text" AS "value"
   FROM "public"."fm_global_figures"
  WHERE ("fm_global_figures"."asrs_type" = 'Mini-Load'::"text")
UNION ALL
 SELECT 'Sprinkler Layout Figures'::"text" AS "metric",
    ("count"(*))::"text" AS "value"
   FROM "public"."fm_global_figures"
  WHERE ("fm_global_figures"."figure_type" = 'Sprinkler Layout'::"text")
UNION ALL
 SELECT 'Open-Top Container Figures'::"text" AS "metric",
    ("count"(*))::"text" AS "value"
   FROM "public"."fm_global_figures"
  WHERE ("fm_global_figures"."container_type" = 'Open-Top'::"text")
UNION ALL
 SELECT 'Closed-Top Container Figures'::"text" AS "metric",
    ("count"(*))::"text" AS "value"
   FROM "public"."fm_global_figures"
  WHERE ("fm_global_figures"."container_type" = 'Closed-Top'::"text");


ALTER VIEW "public"."figure_statistics" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."figure_summary" AS
 SELECT "figure_number",
    "title",
    "normalized_summary",
    "figure_type",
    "asrs_type",
    "container_type",
        CASE
            WHEN ("max_depth_ft" IS NOT NULL) THEN ("max_depth_ft" || ' ft'::"text")
            ELSE 'Variable'::"text"
        END AS "max_depth",
        CASE
            WHEN ("max_spacing_ft" IS NOT NULL) THEN ("max_spacing_ft" || ' ft'::"text")
            ELSE 'Variable'::"text"
        END AS "max_spacing",
    "related_tables",
    "page_number",
    "array_to_string"("search_keywords", ', '::"text") AS "keywords",
    "array_length"("search_keywords", 1) AS "keyword_count"
   FROM "public"."fm_global_figures"
  ORDER BY "figure_number";


ALTER VIEW "public"."figure_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."files" (
    "id" character varying(191) NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "metadata" "jsonb",
    "embedding" "public"."vector",
    "url" "text",
    "status" "text"
);


ALTER TABLE "public"."files" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."financial_contracts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "contract_number" character varying(50) NOT NULL,
    "contract_type" character varying(50) NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "company_id" "uuid",
    "subcontractor_id" "uuid",
    "project_id" bigint,
    "status" character varying(50) DEFAULT 'draft'::character varying,
    "contract_amount" numeric(15,2) DEFAULT 0,
    "change_order_amount" numeric(15,2) DEFAULT 0,
    "revised_amount" numeric(15,2) GENERATED ALWAYS AS (("contract_amount" + "change_order_amount")) STORED,
    "start_date" "date",
    "end_date" "date",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."financial_contracts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fireflies_ingestion_jobs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "fireflies_id" "text" NOT NULL,
    "metadata_id" "text",
    "stage" "text" DEFAULT 'pending'::"text" NOT NULL,
    "attempt_count" integer DEFAULT 0 NOT NULL,
    "last_attempt_at" timestamp with time zone,
    "error_message" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "fireflies_ingestion_jobs_stage_check" CHECK (("stage" = ANY (ARRAY['pending'::"text", 'raw_ingested'::"text", 'segmented'::"text", 'chunked'::"text", 'embedded'::"text", 'structured_extracted'::"text", 'done'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."fireflies_ingestion_jobs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fm_blocks" (
    "id" character varying NOT NULL,
    "section_id" character varying NOT NULL,
    "block_type" character varying NOT NULL,
    "ordinal" integer NOT NULL,
    "source_text" "text" NOT NULL,
    "html" "text" NOT NULL,
    "meta" "jsonb" DEFAULT '{}'::"jsonb",
    "page_reference" integer,
    "inline_figures" integer[],
    "inline_tables" "text"[],
    "search_vector" "tsvector",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."fm_blocks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fm_cost_factors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "component_type" "text" NOT NULL,
    "factor_name" "text" NOT NULL,
    "base_cost_per_unit" numeric,
    "unit_type" "text",
    "complexity_multiplier" numeric DEFAULT 1.0,
    "region_adjustments" "jsonb" DEFAULT '{}'::"jsonb",
    "last_updated" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."fm_cost_factors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fm_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "filename" "text",
    "content" "text",
    "document_type" "text",
    "embedding" "public"."vector"(1536),
    "related_table_ids" "text"[],
    "source" "text",
    "processing_status" "text" DEFAULT 'pending'::"text",
    "processing_notes" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."fm_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fm_form_submissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "text",
    "user_input" "jsonb" NOT NULL,
    "parsed_requirements" "jsonb",
    "matched_table_ids" "text"[],
    "similarity_scores" numeric[],
    "selected_configuration" "jsonb",
    "contact_info" "jsonb",
    "project_details" "jsonb",
    "lead_score" integer,
    "lead_status" "text" DEFAULT 'new'::"text",
    "cost_analysis" "jsonb",
    "recommendations" "jsonb",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "chk_lead_score" CHECK ((("lead_score" >= 0) AND ("lead_score" <= 100))),
    CONSTRAINT "chk_lead_status" CHECK (("lead_status" = ANY (ARRAY['new'::"text", 'qualified'::"text", 'contacted'::"text", 'converted'::"text", 'lost'::"text"])))
);


ALTER TABLE "public"."fm_form_submissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fm_global_tables" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "table_number" integer NOT NULL,
    "table_id" "text" NOT NULL,
    "title" "text" NOT NULL,
    "asrs_type" "text" NOT NULL,
    "system_type" "text" NOT NULL,
    "protection_scheme" "text" NOT NULL,
    "commodity_types" "text"[] DEFAULT '{}'::"text"[],
    "ceiling_height_min_ft" numeric,
    "ceiling_height_max_ft" numeric,
    "storage_height_max_ft" numeric,
    "aisle_width_requirements" "text",
    "rack_configuration" "jsonb",
    "sprinkler_specifications" "jsonb",
    "design_parameters" "jsonb",
    "special_conditions" "text"[],
    "applicable_figures" integer[],
    "estimated_page_number" integer,
    "extraction_status" "text" DEFAULT 'pending'::"text",
    "raw_data" "jsonb",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "section_references" "text"[],
    "container_type" "text",
    "figures" "uuid",
    "image" "text",
    CONSTRAINT "chk_extraction_status" CHECK (("extraction_status" = ANY (ARRAY['pending'::"text", 'extracted'::"text", 'vectorized'::"text", 'verified'::"text"])))
);


ALTER TABLE "public"."fm_global_tables" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fm_optimization_rules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rule_name" "text" NOT NULL,
    "description" "text",
    "trigger_conditions" "jsonb",
    "suggested_changes" "jsonb",
    "estimated_savings_min" numeric,
    "estimated_savings_max" numeric,
    "implementation_difficulty" "text",
    "is_active" boolean DEFAULT true,
    "priority_level" integer DEFAULT 1,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."fm_optimization_rules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fm_optimization_suggestions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "form_submission_id" "uuid",
    "suggestion_type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "original_config" "jsonb",
    "suggested_config" "jsonb",
    "estimated_savings" numeric,
    "implementation_effort" "text",
    "risk_level" "text",
    "technical_justification" "text",
    "applicable_codes" "text"[],
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."fm_optimization_suggestions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fm_sections" (
    "id" character varying NOT NULL,
    "number" character varying NOT NULL,
    "title" character varying NOT NULL,
    "slug" character varying NOT NULL,
    "sort_key" integer NOT NULL,
    "parent_id" character varying,
    "page_start" integer NOT NULL,
    "page_end" integer NOT NULL,
    "section_path" "text"[],
    "breadcrumb_display" "text"[],
    "is_visible" boolean DEFAULT true,
    "section_type" character varying DEFAULT 'section'::character varying,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."fm_sections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fm_sprinkler_configs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "table_id" "text" NOT NULL,
    "ceiling_height_ft" numeric NOT NULL,
    "storage_height_ft" numeric,
    "aisle_width_ft" numeric,
    "sprinkler_count" integer,
    "k_factor" numeric,
    "k_factor_type" "text",
    "pressure_psi" numeric,
    "pressure_bar" numeric,
    "orientation" "text",
    "response_type" "text",
    "temperature_rating" integer,
    "design_area_sqft" numeric,
    "spacing_ft" numeric,
    "coverage_type" "text",
    "special_conditions" "text"[],
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."fm_sprinkler_configs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fm_table_vectors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "table_id" "text" NOT NULL,
    "embedding" "public"."vector"(1536) NOT NULL,
    "content_text" "text" NOT NULL,
    "content_type" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."fm_table_vectors" OWNER TO "postgres";


COMMENT ON TABLE "public"."fm_table_vectors" IS 'Stores OpenAI embeddings (1536 dimensions) for FM Global table content for semantic search';



COMMENT ON COLUMN "public"."fm_table_vectors"."embedding" IS 'OpenAI text-embedding-3-small vector (1536 dimensions)';



CREATE TABLE IF NOT EXISTS "public"."fm_text_chunks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "doc_id" "text" DEFAULT 'FMDS0834'::"text" NOT NULL,
    "doc_version" "text" DEFAULT '2024-07'::"text" NOT NULL,
    "page_number" integer,
    "clause_id" "text",
    "section_path" "text"[],
    "content_type" "text" DEFAULT 'text'::"text" NOT NULL,
    "raw_text" "text" NOT NULL,
    "chunk_summary" "text",
    "chunk_size" integer GENERATED ALWAYS AS ("length"("raw_text")) STORED,
    "search_keywords" "text"[],
    "topics" "text"[],
    "extracted_requirements" "text"[],
    "compliance_type" "text",
    "related_figures" integer[],
    "related_tables" "text"[],
    "related_sections" "text"[],
    "embedding" "public"."vector"(1536),
    "cost_impact" "text",
    "savings_opportunities" "text"[],
    "complexity_score" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "fm_text_chunks_complexity_score_check" CHECK ((("complexity_score" >= 1) AND ("complexity_score" <= 10))),
    CONSTRAINT "fm_text_chunks_cost_impact_check" CHECK (("cost_impact" = ANY (ARRAY['HIGH'::"text", 'MEDIUM'::"text", 'LOW'::"text"])))
);


ALTER TABLE "public"."fm_text_chunks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forecasting" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "budget_item_id" "uuid" NOT NULL,
    "forecast_to_complete" numeric(14,2),
    "projected_costs" numeric(14,2),
    "estimated_completion_cost" numeric(14,2),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."forecasting" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."group_members" (
    "group_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'member'::"text"
);


ALTER TABLE "public"."group_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ingestion_jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "fireflies_id" "text",
    "document_id" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "error" "text",
    "content_hash" "text",
    "started_at" timestamp with time zone DEFAULT "now"(),
    "finished_at" timestamp with time zone
);


ALTER TABLE "public"."ingestion_jobs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."initiatives" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "category" "text" NOT NULL,
    "status" "text" DEFAULT 'active'::"text",
    "priority" "text" DEFAULT 'medium'::"text",
    "completion_percentage" integer DEFAULT 0,
    "owner" "text",
    "team_members" "text"[],
    "stakeholders" "text"[],
    "start_date" "date",
    "target_completion" "date",
    "actual_completion" "date",
    "keywords" "text"[],
    "aliases" "text"[],
    "budget" numeric,
    "budget_used" numeric DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "notes" "text",
    "documentation_links" "text"[],
    "related_project_ids" integer[],
    CONSTRAINT "initiatives_category_check" CHECK (("category" = ANY (ARRAY['hiring'::"text", 'operations'::"text", 'process_improvement'::"text", 'training'::"text", 'technology'::"text", 'compliance'::"text", 'marketing'::"text", 'finance'::"text", 'other'::"text"]))),
    CONSTRAINT "initiatives_completion_percentage_check" CHECK ((("completion_percentage" >= 0) AND ("completion_percentage" <= 100))),
    CONSTRAINT "initiatives_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'urgent'::"text"]))),
    CONSTRAINT "initiatives_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'on_hold'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."initiatives" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."initiatives_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."initiatives_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."initiatives_id_seq" OWNED BY "public"."initiatives"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."issues_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."issues_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."issues_id_seq" OWNED BY "public"."issues"."id";



CREATE TABLE IF NOT EXISTS "public"."meeting_segments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "metadata_id" "text" NOT NULL,
    "segment_index" integer NOT NULL,
    "title" "text",
    "start_index" integer NOT NULL,
    "end_index" integer NOT NULL,
    "summary" "text",
    "decisions" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "risks" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "tasks" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "summary_embedding" "public"."vector"(1536),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "project_ids" integer[] DEFAULT '{}'::integer[]
);


ALTER TABLE "public"."meeting_segments" OWNER TO "postgres";


COMMENT ON COLUMN "public"."meeting_segments"."project_ids" IS 'Array of project IDs discussed in this segment. Used for internal meetings where multiple projects are discussed.';



CREATE TABLE IF NOT EXISTS "public"."memories" (
    "id" bigint NOT NULL,
    "content" "text",
    "metadata" "jsonb",
    "embedding" "public"."vector"(1536)
);


ALTER TABLE "public"."memories" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."memories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."memories_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."memories_id_seq" OWNED BY "public"."memories"."id";



CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" integer NOT NULL,
    "computed_session_user_id" "uuid" GENERATED ALWAYS AS (("split_part"(("session_id")::"text", '~'::"text", 1))::"uuid") STORED,
    "session_id" character varying NOT NULL,
    "message" "jsonb" NOT NULL,
    "message_data" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


ALTER TABLE "public"."messages" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE OR REPLACE VIEW "public"."v_budget_rollup" AS
 WITH "budget_code_aggregates" AS (
         SELECT "bc"."id" AS "budget_code_id",
            "bc"."project_id",
            "bc"."sub_job_id",
            "bc"."cost_code_id",
            "bc"."cost_type_id",
            "bc"."description" AS "budget_code_description",
            "bc"."position",
            "cc"."description" AS "cost_code_description",
            "cc"."division_id" AS "cost_code_division",
            "ccd"."title" AS "division_title",
            "cct"."code" AS "cost_type_code",
            "cct"."description" AS "cost_type_description",
            COALESCE(( SELECT "sum"("bli"."original_amount") AS "sum"
                   FROM "public"."budget_line_items" "bli"
                  WHERE ("bli"."budget_code_id" = "bc"."id")), (0)::numeric) AS "original_budget_amount",
            COALESCE(( SELECT "sum"("bm"."amount") AS "sum"
                   FROM ("public"."budget_modifications" "bm"
                     JOIN "public"."budget_items" "bi" ON (("bm"."budget_item_id" = "bi"."id")))
                  WHERE (("bi"."budget_code_id" = "bc"."id") AND ("bm"."approved" = true))), (0)::numeric) AS "budget_modifications",
            COALESCE(( SELECT "sum"("col"."amount") AS "sum"
                   FROM ("public"."change_order_line_items" "col"
                     JOIN "public"."change_orders" "co" ON (("col"."change_order_id" = "co"."id")))
                  WHERE (("col"."budget_code_id" = "bc"."id") AND ("co"."status" = 'approved'::"text"))), (0)::numeric) AS "approved_cos",
            COALESCE(( SELECT "sum"("dcl"."amount") AS "sum"
                   FROM "public"."direct_cost_line_items" "dcl"
                  WHERE (("dcl"."budget_code_id" = "bc"."id") AND ("dcl"."approved" = true))), (0)::numeric) AS "direct_costs",
            COALESCE(( SELECT "sum"("bm"."amount") AS "sum"
                   FROM ("public"."budget_modifications" "bm"
                     JOIN "public"."budget_items" "bi" ON (("bm"."budget_item_id" = "bi"."id")))
                  WHERE (("bi"."budget_code_id" = "bc"."id") AND ("bm"."approved" = false))), (0)::numeric) AS "pending_changes",
            0 AS "committed_costs",
            0 AS "pending_cost_changes"
           FROM ((("public"."budget_codes" "bc"
             LEFT JOIN "public"."cost_codes" "cc" ON (("bc"."cost_code_id" = "cc"."id")))
             LEFT JOIN "public"."cost_code_divisions" "ccd" ON (("cc"."division_id" = "ccd"."id")))
             LEFT JOIN "public"."cost_code_types" "cct" ON (("bc"."cost_type_id" = "cct"."id")))
        )
 SELECT "budget_code_id",
    "project_id",
    "sub_job_id",
    "cost_code_id",
    "cost_type_id",
    "budget_code_description",
    "cost_code_description",
    "cost_code_division",
    "division_title",
    "cost_type_code",
    "cost_type_description",
    "position",
    "original_budget_amount",
    "budget_modifications",
    "approved_cos",
    (("original_budget_amount" + "budget_modifications") + "approved_cos") AS "revised_budget",
    "direct_costs" AS "job_to_date_cost",
    "direct_costs",
    "pending_changes" AS "pending_budget_changes",
    ((("original_budget_amount" + "budget_modifications") + "approved_cos") + "pending_changes") AS "projected_budget",
    "committed_costs",
    "pending_cost_changes",
    ("committed_costs" + "pending_cost_changes") AS "projected_costs",
    ((("committed_costs" + "pending_cost_changes"))::numeric - "direct_costs") AS "forecast_to_complete",
    ("direct_costs" + ((("committed_costs" + "pending_cost_changes"))::numeric - "direct_costs")) AS "estimated_cost_at_completion",
    (((("original_budget_amount" + "budget_modifications") + "approved_cos") + "pending_changes") - ("direct_costs" + ((("committed_costs" + "pending_cost_changes"))::numeric - "direct_costs"))) AS "projected_over_under"
   FROM "budget_code_aggregates";


ALTER VIEW "public"."v_budget_rollup" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."mv_budget_rollup" AS
 SELECT "budget_code_id",
    "project_id",
    "sub_job_id",
    "cost_code_id",
    "cost_type_id",
    "budget_code_description",
    "cost_code_description",
    "cost_code_division",
    "division_title",
    "cost_type_code",
    "cost_type_description",
    "position",
    "original_budget_amount",
    "budget_modifications",
    "approved_cos",
    "revised_budget",
    "job_to_date_cost",
    "direct_costs",
    "pending_budget_changes",
    "projected_budget",
    "committed_costs",
    "pending_cost_changes",
    "projected_costs",
    "forecast_to_complete",
    "estimated_cost_at_completion",
    "projected_over_under"
   FROM "public"."v_budget_rollup"
  WITH NO DATA;


ALTER MATERIALIZED VIEW "public"."mv_budget_rollup" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."nods_page" (
    "id" bigint NOT NULL,
    "parent_page_id" bigint,
    "path" "text" NOT NULL,
    "checksum" "text",
    "meta" "jsonb",
    "type" "text",
    "source" "text"
);


ALTER TABLE "public"."nods_page" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."nods_page_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."nods_page_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."nods_page_id_seq" OWNED BY "public"."nods_page"."id";



CREATE TABLE IF NOT EXISTS "public"."nods_page_section" (
    "id" bigint NOT NULL,
    "page_id" bigint NOT NULL,
    "content" "text",
    "token_count" integer,
    "embedding" "public"."vector"(1536),
    "slug" "text",
    "heading" "text"
);


ALTER TABLE "public"."nods_page_section" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."nods_page_section_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."nods_page_section_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."nods_page_section_id_seq" OWNED BY "public"."nods_page_section"."id";



CREATE TABLE IF NOT EXISTS "public"."notes" (
    "id" bigint NOT NULL,
    "project_id" bigint NOT NULL,
    "title" "text",
    "body" "text",
    "created_by" "uuid" DEFAULT "auth"."uid"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "archived" boolean DEFAULT false
);


ALTER TABLE "public"."notes" OWNER TO "postgres";


ALTER TABLE "public"."notes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."notes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE OR REPLACE VIEW "public"."open_tasks_view" AS
 SELECT "t"."id",
    "t"."project_id",
    "t"."source_document_id",
    "t"."title",
    "t"."description",
    "t"."assignee",
    "t"."status",
    "t"."due_date",
    "t"."created_by",
    "t"."metadata",
    "t"."created_at",
    "t"."updated_at",
    "p"."name" AS "project_name",
    "dm"."title" AS "source_document_title"
   FROM (("public"."ai_tasks" "t"
     LEFT JOIN "public"."projects" "p" ON (("p"."id" = "t"."project_id")))
     LEFT JOIN "public"."document_metadata" "dm" ON (("dm"."id" = "t"."source_document_id")))
  WHERE ("t"."status" = ANY (ARRAY['open'::"text", 'in_progress'::"text"]));


ALTER VIEW "public"."open_tasks_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."opportunities" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "metadata_id" "text" NOT NULL,
    "segment_id" "uuid",
    "source_chunk_id" "uuid",
    "description" "text" NOT NULL,
    "type" "text",
    "owner_name" "text",
    "owner_email" "text",
    "project_id" bigint,
    "client_id" bigint,
    "next_step" "text",
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "embedding" "public"."vector"(1536),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "project_ids" integer[] DEFAULT '{}'::integer[],
    CONSTRAINT "opportunities_status_check" CHECK (("status" = ANY (ARRAY['open'::"text", 'in_review'::"text", 'approved'::"text", 'rejected'::"text", 'implemented'::"text"])))
);


ALTER TABLE "public"."opportunities" OWNER TO "postgres";


COMMENT ON COLUMN "public"."opportunities"."project_ids" IS 'Array of project IDs this opportunity relates to. Allows opportunities to span multiple projects.';



CREATE TABLE IF NOT EXISTS "public"."optimization_rules" (
    "id" integer NOT NULL,
    "condition_from" "jsonb",
    "condition_to" "jsonb",
    "cost_impact" numeric,
    "description" "text",
    "embedding" "public"."vector"(1536)
);


ALTER TABLE "public"."optimization_rules" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."optimization_rules_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."optimization_rules_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."optimization_rules_id_seq" OWNED BY "public"."optimization_rules"."id";



ALTER TABLE "public"."owner_invoice_line_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."owner_invoice_line_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."owner_invoices" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."owner_invoices_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."parts" (
    "id" character varying NOT NULL,
    "messageId" character varying NOT NULL,
    "type" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "text_text" "text",
    "reasoning_text" "text",
    "file_mediaType" character varying,
    "file_filename" character varying,
    "file_url" character varying,
    "source_url_sourceId" character varying,
    "source_url_url" character varying,
    "source_url_title" character varying,
    "source_document_sourceId" character varying,
    "source_document_mediaType" character varying,
    "source_document_title" character varying,
    "source_document_filename" character varying,
    "tool_toolCallId" character varying,
    "tool_state" character varying,
    "tool_errorText" character varying,
    "tool_getWeatherInformation_input" "jsonb",
    "tool_getWeatherInformation_output" "jsonb",
    "tool_getLocation_input" "jsonb",
    "tool_getLocation_output" "jsonb",
    "data_weather_id" character varying,
    "data_weather_location" character varying,
    "data_weather_weather" character varying,
    "data_weather_temperature" real,
    "providerMetadata" "jsonb",
    CONSTRAINT "data_weather_fields_required" CHECK (
CASE
    WHEN (("type")::"text" = 'data-weather'::"text") THEN (("data_weather_location" IS NOT NULL) AND ("data_weather_weather" IS NOT NULL) AND ("data_weather_temperature" IS NOT NULL))
    ELSE true
END),
    CONSTRAINT "file_fields_required_if_type_is_file" CHECK (
CASE
    WHEN (("type")::"text" = 'file'::"text") THEN (("file_mediaType" IS NOT NULL) AND ("file_url" IS NOT NULL))
    ELSE true
END),
    CONSTRAINT "reasoning_text_required_if_type_is_reasoning" CHECK (
CASE
    WHEN (("type")::"text" = 'reasoning'::"text") THEN ("reasoning_text" IS NOT NULL)
    ELSE true
END),
    CONSTRAINT "source_document_fields_required_if_type_is_source_document" CHECK (
CASE
    WHEN (("type")::"text" = 'source_document'::"text") THEN (("source_document_sourceId" IS NOT NULL) AND ("source_document_mediaType" IS NOT NULL) AND ("source_document_title" IS NOT NULL))
    ELSE true
END),
    CONSTRAINT "source_url_fields_required_if_type_is_source_url" CHECK (
CASE
    WHEN (("type")::"text" = 'source_url'::"text") THEN (("source_url_sourceId" IS NOT NULL) AND ("source_url_url" IS NOT NULL))
    ELSE true
END),
    CONSTRAINT "text_text_required_if_type_is_text" CHECK (
CASE
    WHEN (("type")::"text" = 'text'::"text") THEN ("text_text" IS NOT NULL)
    ELSE true
END),
    CONSTRAINT "tool_getLocation_fields_required" CHECK (
CASE
    WHEN (("type")::"text" = 'tool-getLocation'::"text") THEN (("tool_toolCallId" IS NOT NULL) AND ("tool_state" IS NOT NULL))
    ELSE true
END),
    CONSTRAINT "tool_getWeatherInformation_fields_required" CHECK (
CASE
    WHEN (("type")::"text" = 'tool-getWeatherInformation'::"text") THEN (("tool_toolCallId" IS NOT NULL) AND ("tool_state" IS NOT NULL))
    ELSE true
END)
);


ALTER TABLE "public"."parts" OWNER TO "postgres";


ALTER TABLE "public"."payment_transactions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."payment_transactions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."pcco_line_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pcco_line_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."pco_line_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pco_line_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."pending_budget_changes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "budget_item_id" "uuid" NOT NULL,
    "description" "text",
    "amount" numeric(14,2) NOT NULL,
    "status" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "pending_budget_changes_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'pending'::"text", 'sent'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."pending_budget_changes" OWNER TO "postgres";


ALTER TABLE "public"."prime_contract_change_orders" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."prime_contract_change_orders_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."prime_contract_sovs" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."prime_contract_sovs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."prime_potential_change_orders" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."prime_potential_change_orders_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."processing_queue" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "document_id" "uuid" NOT NULL,
    "job_type" "text" NOT NULL,
    "status" "text" DEFAULT 'queued'::"text",
    "priority" integer DEFAULT 5,
    "attempts" integer DEFAULT 0,
    "max_attempts" integer DEFAULT 3,
    "error_message" "text",
    "config" "jsonb" DEFAULT '{}'::"jsonb",
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "processing_queue_job_type_check" CHECK (("job_type" = ANY (ARRAY['chunk'::"text", 'embed'::"text", 'index'::"text"]))),
    CONSTRAINT "processing_queue_status_check" CHECK (("status" = ANY (ARRAY['queued'::"text", 'processing'::"text", 'completed'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."processing_queue" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."procore_capture_sessions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    "capture_type" "text" NOT NULL,
    "status" "text" DEFAULT 'in_progress'::"text" NOT NULL,
    "total_screenshots" integer DEFAULT 0,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "procore_capture_sessions_capture_type_check" CHECK (("capture_type" = ANY (ARRAY['public_docs'::"text", 'authenticated_app'::"text", 'manual'::"text"]))),
    CONSTRAINT "procore_capture_sessions_status_check" CHECK (("status" = ANY (ARRAY['in_progress'::"text", 'completed'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."procore_capture_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."procore_modules" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "category" "text" NOT NULL,
    "app_path" "text",
    "docs_url" "text",
    "complexity" "text",
    "priority" "text",
    "estimated_build_weeks" integer,
    "key_features" "jsonb" DEFAULT '[]'::"jsonb",
    "dependencies" "jsonb" DEFAULT '[]'::"jsonb",
    "notes" "text",
    "rebuild_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "procore_modules_complexity_check" CHECK (("complexity" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'very_high'::"text"]))),
    CONSTRAINT "procore_modules_priority_check" CHECK (("priority" = ANY (ARRAY['must_have'::"text", 'nice_to_have'::"text", 'skip'::"text"])))
);


ALTER TABLE "public"."procore_modules" OWNER TO "postgres";


COMMENT ON TABLE "public"."procore_modules" IS 'Procore modules/features catalog with rebuild assessment';



CREATE TABLE IF NOT EXISTS "public"."procore_screenshots" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "session_id" "uuid",
    "name" "text" NOT NULL,
    "category" "text" NOT NULL,
    "subcategory" "text",
    "source_url" "text",
    "page_title" "text",
    "fullpage_path" "text",
    "viewport_path" "text",
    "fullpage_storage_path" "text",
    "viewport_storage_path" "text",
    "viewport_width" integer,
    "viewport_height" integer,
    "fullpage_height" integer,
    "file_size_bytes" integer,
    "description" "text",
    "detected_components" "jsonb" DEFAULT '[]'::"jsonb",
    "color_palette" "jsonb" DEFAULT '[]'::"jsonb",
    "ai_analysis" "jsonb",
    "captured_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."procore_screenshots" OWNER TO "postgres";


COMMENT ON TABLE "public"."procore_screenshots" IS 'Captured screenshots from Procore application';



CREATE OR REPLACE VIEW "public"."procore_capture_summary" AS
 SELECT "m"."category",
    "m"."name" AS "module_name",
    "m"."display_name",
    "m"."priority",
    "m"."complexity",
    "count"(DISTINCT "s"."id") AS "screenshot_count",
    "max"("s"."captured_at") AS "last_captured"
   FROM ("public"."procore_modules" "m"
     LEFT JOIN "public"."procore_screenshots" "s" ON (("s"."name" ~~ (('%'::"text" || "m"."name") || '%'::"text"))))
  GROUP BY "m"."category", "m"."name", "m"."display_name", "m"."priority", "m"."complexity"
  ORDER BY "m"."category", "m"."priority";


ALTER VIEW "public"."procore_capture_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."procore_components" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "screenshot_id" "uuid",
    "component_type" "text" NOT NULL,
    "component_name" "text",
    "x" integer,
    "y" integer,
    "width" integer,
    "height" integer,
    "local_path" "text",
    "storage_path" "text",
    "styles" "jsonb",
    "content" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."procore_components" OWNER TO "postgres";


COMMENT ON TABLE "public"."procore_components" IS 'UI components extracted from screenshots';



CREATE TABLE IF NOT EXISTS "public"."procore_features" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "module_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text",
    "include_in_rebuild" boolean DEFAULT true,
    "complexity" "text",
    "estimated_hours" integer,
    "ai_enhancement_possible" boolean DEFAULT false,
    "ai_enhancement_notes" "text",
    "screenshot_ids" "uuid"[] DEFAULT '{}'::"uuid"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "procore_features_complexity_check" CHECK (("complexity" = ANY (ARRAY['trivial'::"text", 'easy'::"text", 'medium'::"text", 'hard'::"text", 'very_hard'::"text"])))
);


ALTER TABLE "public"."procore_features" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."procore_rebuild_estimate" AS
 SELECT "category",
    "count"(*) AS "module_count",
    "sum"(
        CASE
            WHEN ("priority" = 'must_have'::"text") THEN "estimated_build_weeks"
            ELSE 0
        END) AS "must_have_weeks",
    "sum"(
        CASE
            WHEN ("priority" = 'nice_to_have'::"text") THEN "estimated_build_weeks"
            ELSE 0
        END) AS "nice_to_have_weeks",
    "sum"("estimated_build_weeks") AS "total_weeks"
   FROM "public"."procore_modules"
  WHERE ("priority" <> 'skip'::"text")
  GROUP BY "category"
  ORDER BY "category";


ALTER VIEW "public"."procore_rebuild_estimate" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "website" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "job_number" "text",
    "start_date" "date",
    "est_completion" "date",
    "est_revenue" numeric,
    "est_profit" numeric,
    "address" "text",
    "onedrive" "text",
    "phase" "text",
    "state" "text",
    "client_id" bigint,
    "category" "text",
    "team_members" "text"[] DEFAULT '{}'::"text"[],
    "completion_percentage" integer DEFAULT 0,
    "budget" numeric(12,2),
    "budget_used" numeric(12,2) DEFAULT 0,
    "client" "text",
    "summary" "text",
    "summary_metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "summary_updated_at" timestamp with time zone,
    "health_score" numeric(5,2),
    "health_status" "text",
    "access" "text",
    "archived" boolean DEFAULT false NOT NULL,
    "archived_by" "uuid",
    "archived_at" timestamp with time zone,
    "erp_system" "text",
    "erp_last_job_cost_sync" timestamp with time zone,
    "erp_last_direct_cost_sync" timestamp with time zone,
    "erp_sync_status" "text",
    "project_manager" bigint,
    "type" "text",
    "project_number" character varying(50),
    "stakeholders" "jsonb" DEFAULT '[]'::"jsonb",
    "keywords" "text"[],
    "budget_locked" boolean DEFAULT false,
    "budget_locked_at" timestamp with time zone,
    "budget_locked_by" "uuid",
    "work_scope" "text",
    "project_sector" "text",
    "delivery_method" "text",
    "name_code" "text",
    CONSTRAINT "projects_delivery_method_check" CHECK ((("delivery_method" IS NULL) OR ("delivery_method" = ANY (ARRAY['Design-Bid-Build'::"text", 'Design-Build'::"text", 'Construction Management at Risk'::"text", 'Integrated Project Delivery'::"text"])))),
    CONSTRAINT "projects_health_status_check" CHECK (("health_status" = ANY (ARRAY['Healthy'::"text", 'At Risk'::"text", 'Needs Attention'::"text", 'Critical'::"text"]))),
    CONSTRAINT "projects_project_sector_check" CHECK ((("project_sector" IS NULL) OR ("project_sector" = ANY (ARRAY['Commercial'::"text", 'Industrial'::"text", 'Infrastructure'::"text", 'Healthcare'::"text", 'Institutional'::"text", 'Residential'::"text"])))),
    CONSTRAINT "projects_work_scope_check" CHECK ((("work_scope" IS NULL) OR ("work_scope" = ANY (ARRAY['Ground-Up Construction'::"text", 'Renovation'::"text", 'Tenant Improvement'::"text", 'Interior Build-Out'::"text", 'Maintenance'::"text"]))))
);


ALTER TABLE "public"."project" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."project_activity_view" AS
 SELECT "p"."id" AS "project_id",
    "p"."name",
    COALESCE("count"(DISTINCT "dm"."id"), (0)::bigint) AS "meeting_count",
    COALESCE("count"(DISTINCT
        CASE
            WHEN ("t"."status" = ANY (ARRAY['open'::"text", 'in_progress'::"text"])) THEN "t"."id"
            ELSE NULL::"uuid"
        END), (0)::bigint) AS "open_tasks",
    "max"("dm"."captured_at") AS "last_meeting_at",
    "max"("t"."updated_at") AS "last_task_update"
   FROM (("public"."projects" "p"
     LEFT JOIN "public"."document_metadata" "dm" ON (("dm"."project_id" = "p"."id")))
     LEFT JOIN "public"."ai_tasks" "t" ON (("t"."project_id" = "p"."id")))
  GROUP BY "p"."id", "p"."name";


ALTER VIEW "public"."project_activity_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_briefings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" bigint NOT NULL,
    "briefing_content" "text" NOT NULL,
    "briefing_type" character varying(50) DEFAULT 'executive_summary'::character varying,
    "source_documents" "text"[] NOT NULL,
    "generated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "generated_by" character varying(100),
    "token_count" integer,
    "version" integer DEFAULT 1
);


ALTER TABLE "public"."project_briefings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_cost_codes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint NOT NULL,
    "cost_code_id" "text" NOT NULL,
    "cost_type_id" "uuid",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."project_cost_codes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_directory" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint,
    "company_id" "uuid",
    "role" "text" NOT NULL,
    "is_active" boolean DEFAULT true,
    "permissions" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "project_directory_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'architect'::"text", 'engineer'::"text", 'subcontractor'::"text", 'vendor'::"text"])))
);


ALTER TABLE "public"."project_directory" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."project_health_dashboard" AS
 SELECT "id",
    "name",
    "current_phase",
    "completion_percentage",
    "health_score",
    "health_status",
    "summary",
    "summary_updated_at",
        CASE
            WHEN (("budget" IS NOT NULL) AND ("budget" > (0)::numeric) AND ("budget_used" IS NOT NULL)) THEN ((("budget_used")::numeric / ("budget")::numeric) * (100)::numeric)
            ELSE (0)::numeric
        END AS "budget_utilization",
    "est completion",
    ( SELECT "count"(*) AS "count"
           FROM "public"."ai_insights" "ai"
          WHERE ("ai"."project_id" = "p"."id")) AS "total_insights_count",
    ( SELECT "count"(*) AS "count"
           FROM "public"."ai_insights" "ai"
          WHERE (("ai"."project_id" = "p"."id") AND ("ai"."severity" = 'critical'::"text") AND (("ai"."resolved" = 0) OR ("ai"."resolved" IS NULL)))) AS "open_critical_items",
    ( SELECT "count"(*) AS "count"
           FROM "public"."documents" "d"
          WHERE (("d"."project_id" = "p"."id") AND ("d"."created_at" > ("now"() - '30 days'::interval)))) AS "recent_documents_count",
    ( SELECT "max"(("d"."created_at")::"date") AS "max"
           FROM "public"."documents" "d"
          WHERE ("d"."project_id" = "p"."id")) AS "last_document_date"
   FROM "public"."projects" "p"
  WHERE ("name" IS NOT NULL)
  ORDER BY
        CASE
            WHEN ("health_score" IS NULL) THEN (999)::numeric
            ELSE "health_score"
        END;


ALTER VIEW "public"."project_health_dashboard" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."project_health_dashboard_no_summary" WITH ("security_invoker"='on') AS
 SELECT "id",
    "name",
    "current_phase",
    "completion_percentage",
    "health_score",
    "health_status",
    "summary_updated_at",
        CASE
            WHEN (("budget" IS NOT NULL) AND ("budget" > (0)::numeric) AND ("budget_used" IS NOT NULL)) THEN ((("budget_used")::numeric / ("budget")::numeric) * (100)::numeric)
            ELSE (0)::numeric
        END AS "budget_utilization",
    "est completion",
    ( SELECT "count"(*) AS "count"
           FROM "public"."ai_insights" "ai"
          WHERE ("ai"."project_id" = "p"."id")) AS "total_insights_count",
    ( SELECT "count"(*) AS "count"
           FROM "public"."ai_insights" "ai"
          WHERE (("ai"."project_id" = "p"."id") AND ("ai"."severity" = 'critical'::"text") AND (("ai"."resolved" = 0) OR ("ai"."resolved" IS NULL)))) AS "open_critical_items",
    ( SELECT "count"(*) AS "count"
           FROM "public"."documents" "d"
          WHERE (("d"."project_id" = "p"."id") AND ("d"."created_at" > ("now"() - '30 days'::interval)))) AS "recent_documents_count",
    ( SELECT "max"(("d"."created_at")::"date") AS "max"
           FROM "public"."documents" "d"
          WHERE ("d"."project_id" = "p"."id")) AS "last_document_date"
   FROM "public"."projects" "p"
  WHERE ("name" IS NOT NULL)
  ORDER BY
        CASE
            WHEN ("health_score" IS NULL) THEN (999)::numeric
            ELSE "health_score"
        END;


ALTER VIEW "public"."project_health_dashboard_no_summary" OWNER TO "postgres";


ALTER TABLE "public"."project" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."project_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."project_insights" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" integer NOT NULL,
    "summary" "text" NOT NULL,
    "detail" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "severity" "text",
    "captured_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "source_document_ids" "text"[] DEFAULT ARRAY[]::"text"[],
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."project_insights" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."project_issue_summary" AS
 SELECT "p"."id" AS "project_id",
    "p"."name" AS "project_name",
    "count"("i"."id") AS "total_issues",
    "sum"("i"."total_cost") AS "total_cost",
    "round"("avg"("i"."total_cost"), 2) AS "avg_cost_per_issue"
   FROM ("public"."projects" "p"
     LEFT JOIN "public"."issues" "i" ON (("p"."id" = "i"."project_id")))
  GROUP BY "p"."id", "p"."name"
  ORDER BY ("sum"("i"."total_cost")) DESC NULLS LAST;


ALTER VIEW "public"."project_issue_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "access" "text" NOT NULL,
    "permissions" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."project_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_resources" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "description" "text",
    "type" "text",
    "project_id" bigint
);


ALTER TABLE "public"."project_resources" OWNER TO "postgres";


ALTER TABLE "public"."project_resources" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."project_resources_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."project_tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint,
    "task_description" "text" NOT NULL,
    "assigned_to" "text",
    "due_date" "date",
    "priority" "text",
    "status" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "project_tasks_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'critical'::"text"]))),
    CONSTRAINT "project_tasks_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'in_progress'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."project_tasks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" character varying(100) NOT NULL,
    "permissions" "jsonb",
    "assigned_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."project_users" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."project_with_manager" AS
 SELECT "p"."id",
    "p"."created_at",
    "p"."name",
    "p"."job number",
    "p"."start date",
    "p"."est completion",
    "p"."est revenue",
    "p"."est profit",
    "p"."address",
    "p"."onedrive",
    "p"."phase",
    "p"."state",
    "p"."client_id",
    "p"."category",
    "p"."aliases",
    "p"."team_members",
    "p"."current_phase",
    "p"."completion_percentage",
    "p"."budget",
    "p"."budget_used",
    "p"."client",
    "p"."summary",
    "p"."summary_metadata",
    "p"."summary_updated_at",
    "p"."health_score",
    "p"."health_status",
    "p"."access",
    "p"."archived",
    "p"."archived_by",
    "p"."archived_at",
    "p"."erp_system",
    "p"."erp_last_job_cost_sync",
    "p"."erp_last_direct_cost_sync",
    "p"."erp_sync_status",
    "p"."project_manager",
    "e"."id" AS "manager_id",
    (("e"."first_name" || ' '::"text") || "e"."last_name") AS "manager_name",
    "e"."email" AS "manager_email"
   FROM ("public"."projects" "p"
     LEFT JOIN "public"."employees" "e" ON (("e"."id" = "p"."project_manager")));


ALTER VIEW "public"."project_with_manager" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects_audit" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint,
    "operation" "text" NOT NULL,
    "changed_by" "uuid",
    "changed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "changed_columns" "text"[],
    "old_data" "jsonb",
    "new_data" "jsonb",
    "metadata" "jsonb"
);


ALTER TABLE "public"."projects_audit" OWNER TO "postgres";


ALTER TABLE "public"."projects" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."projects_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."prospects" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "company_name" "text" NOT NULL,
    "contact_name" "text",
    "contact_title" "text",
    "contact_email" "text",
    "contact_phone" "text",
    "lead_source" "text",
    "referral_contact" "text",
    "industry" "text",
    "project_type" "text",
    "estimated_project_value" numeric(14,2),
    "estimated_start_date" "date",
    "status" "text" DEFAULT 'New'::"text",
    "probability" integer DEFAULT 0,
    "next_follow_up" "date",
    "last_contacted" timestamp with time zone,
    "assigned_to" "text",
    "notes" "text",
    "tags" "text"[],
    "client_id" bigint,
    "project_id" bigint,
    "ai_summary" "text",
    "ai_score" numeric(5,2),
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    CONSTRAINT "prospects_probability_check" CHECK ((("probability" >= 0) AND ("probability" <= 100)))
);


ALTER TABLE "public"."prospects" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."prospects_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."prospects_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."prospects_id_seq" OWNED BY "public"."prospects"."id";



CREATE TABLE IF NOT EXISTS "public"."qto_items" (
    "id" bigint NOT NULL,
    "qto_id" bigint NOT NULL,
    "project_id" bigint NOT NULL,
    "cost_code" "text",
    "division" "text",
    "item_code" "text",
    "description" "text",
    "unit" "text",
    "quantity" numeric DEFAULT 0,
    "unit_cost" numeric DEFAULT 0,
    "extended_cost" numeric GENERATED ALWAYS AS (("quantity" * "unit_cost")) STORED,
    "source_reference" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."qto_items" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."qto_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."qto_items_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."qto_items_id_seq" OWNED BY "public"."qto_items"."id";



CREATE TABLE IF NOT EXISTS "public"."qtos" (
    "id" bigint NOT NULL,
    "project_id" bigint NOT NULL,
    "title" "text",
    "version" integer DEFAULT 1,
    "created_by" "uuid" DEFAULT "auth"."uid"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "notes" "text",
    "status" "text" DEFAULT 'draft'::"text"
);


ALTER TABLE "public"."qtos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."qtos_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."qtos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."qtos_id_seq" OWNED BY "public"."qtos"."id";



CREATE TABLE IF NOT EXISTS "public"."rag_pipeline_state" (
    "pipeline_id" "text" NOT NULL,
    "pipeline_type" "text" NOT NULL,
    "last_check_time" timestamp without time zone,
    "known_files" "jsonb",
    "last_run" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."rag_pipeline_state" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."requests" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "user_query" "text" NOT NULL
);


ALTER TABLE "public"."requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."review_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "review_id" "uuid" NOT NULL,
    "document_id" "uuid",
    "discrepancy_id" "uuid",
    "comment_type" character varying(50) DEFAULT 'general'::character varying,
    "comment" "text" NOT NULL,
    "location_in_doc" "jsonb",
    "priority" character varying(50) DEFAULT 'normal'::character varying,
    "status" character varying(50) DEFAULT 'open'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid" NOT NULL,
    CONSTRAINT "review_comments_priority_check" CHECK ((("priority")::"text" = ANY ((ARRAY['low'::character varying, 'normal'::character varying, 'high'::character varying])::"text"[]))),
    CONSTRAINT "review_comments_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['open'::character varying, 'addressed'::character varying, 'resolved'::character varying])::"text"[])))
);


ALTER TABLE "public"."review_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "submittal_id" "uuid" NOT NULL,
    "reviewer_id" "uuid" NOT NULL,
    "review_type" character varying(50) NOT NULL,
    "status" character varying(50) DEFAULT 'pending'::character varying,
    "decision" character varying(50),
    "comments" "text",
    "review_criteria_met" "jsonb",
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "due_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "reviews_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'skipped'::character varying])::"text"[])))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


COMMENT ON TABLE "public"."reviews" IS 'Submittal review workflow with human and AI participation';



CREATE TABLE IF NOT EXISTS "public"."rfi_assignees" (
    "rfi_id" "uuid" NOT NULL,
    "employee_id" bigint NOT NULL,
    "is_primary" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."rfi_assignees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rfis" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint NOT NULL,
    "number" integer NOT NULL,
    "subject" "text" NOT NULL,
    "question" "text" NOT NULL,
    "status" "text" DEFAULT 'Open'::"text" NOT NULL,
    "due_date" "date",
    "date_initiated" "date",
    "closed_date" "date",
    "rfi_manager" "text",
    "received_from" "text",
    "assignees" "text"[],
    "distribution_list" "text"[],
    "ball_in_court" "text",
    "responsible_contractor" "text",
    "specification" "text",
    "location" "text",
    "sub_job" "text",
    "cost_code" "text",
    "rfi_stage" "text",
    "schedule_impact" "text",
    "cost_impact" "text",
    "reference" "text",
    "is_private" boolean DEFAULT false NOT NULL,
    "created_by" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "rfi_manager_employee_id" bigint,
    "ball_in_court_employee_id" bigint,
    "created_by_employee_id" bigint
);


ALTER TABLE "public"."rfis" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."risks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "metadata_id" "text" NOT NULL,
    "segment_id" "uuid",
    "source_chunk_id" "uuid",
    "description" "text" NOT NULL,
    "category" "text",
    "likelihood" "text",
    "impact" "text",
    "owner_name" "text",
    "owner_email" "text",
    "project_id" bigint,
    "client_id" bigint,
    "mitigation_plan" "text",
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "embedding" "public"."vector"(1536),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "project_ids" integer[] DEFAULT '{}'::integer[],
    CONSTRAINT "risks_impact_check" CHECK (("impact" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text"]))),
    CONSTRAINT "risks_likelihood_check" CHECK (("likelihood" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text"]))),
    CONSTRAINT "risks_status_check" CHECK (("status" = ANY (ARRAY['open'::"text", 'mitigated'::"text", 'closed'::"text", 'occurred'::"text"])))
);


ALTER TABLE "public"."risks" OWNER TO "postgres";


COMMENT ON COLUMN "public"."risks"."project_ids" IS 'Array of project IDs this risk relates to. Allows risks to affect multiple projects.';



CREATE TABLE IF NOT EXISTS "public"."schedule_of_values" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "contract_id" bigint,
    "commitment_id" "uuid",
    "status" "text" DEFAULT 'draft'::"text",
    "total_amount" numeric(15,2) DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "approved_at" timestamp with time zone,
    "approved_by" "uuid",
    CONSTRAINT "either_contract_or_commitment" CHECK (((("contract_id" IS NOT NULL) AND ("commitment_id" IS NULL)) OR (("contract_id" IS NULL) AND ("commitment_id" IS NOT NULL)))),
    CONSTRAINT "schedule_of_values_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'pending_approval'::"text", 'approved'::"text", 'revised'::"text"])))
);


ALTER TABLE "public"."schedule_of_values" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schedule_progress_updates" (
    "id" bigint NOT NULL,
    "task_id" bigint NOT NULL,
    "reported_at" timestamp with time zone DEFAULT "now"(),
    "percent_complete" numeric(5,2),
    "actual_start" "date",
    "actual_finish" "date",
    "actual_hours" numeric,
    "notes" "text",
    "reported_by" "uuid" DEFAULT "auth"."uid"()
);


ALTER TABLE "public"."schedule_progress_updates" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."schedule_progress_updates_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."schedule_progress_updates_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."schedule_progress_updates_id_seq" OWNED BY "public"."schedule_progress_updates"."id";



CREATE TABLE IF NOT EXISTS "public"."schedule_resources" (
    "id" bigint NOT NULL,
    "task_id" bigint NOT NULL,
    "resource_id" "uuid",
    "resource_type" "text",
    "role" "text",
    "units" numeric,
    "unit_type" "text",
    "rate" numeric,
    "cost" numeric GENERATED ALWAYS AS (("units" * "rate")) STORED,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schedule_resources" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."schedule_resources_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."schedule_resources_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."schedule_resources_id_seq" OWNED BY "public"."schedule_resources"."id";



CREATE TABLE IF NOT EXISTS "public"."schedule_task_dependencies" (
    "id" bigint NOT NULL,
    "task_id" bigint NOT NULL,
    "predecessor_task_id" bigint NOT NULL,
    "dependency_type" "text" DEFAULT 'FS'::"text"
);


ALTER TABLE "public"."schedule_task_dependencies" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."schedule_task_dependencies_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."schedule_task_dependencies_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."schedule_task_dependencies_id_seq" OWNED BY "public"."schedule_task_dependencies"."id";



CREATE TABLE IF NOT EXISTS "public"."schedule_tasks" (
    "id" bigint NOT NULL,
    "schedule_id" bigint NOT NULL,
    "project_id" bigint NOT NULL,
    "parent_task_id" bigint,
    "name" "text" NOT NULL,
    "description" "text",
    "task_type" "text",
    "sequence" integer DEFAULT 0,
    "start_date" "date",
    "finish_date" "date",
    "duration_days" integer,
    "percent_complete" numeric(5,2) DEFAULT 0,
    "float_order" numeric DEFAULT 0,
    "predecessor_ids" "text",
    "created_by" "uuid" DEFAULT "auth"."uid"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schedule_tasks" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."schedule_tasks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."schedule_tasks_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."schedule_tasks_id_seq" OWNED BY "public"."schedule_tasks"."id";



CREATE TABLE IF NOT EXISTS "public"."sources" (
    "source_id" "text" NOT NULL,
    "summary" "text",
    "total_word_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."sources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sov_line_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sov_id" "uuid",
    "line_number" integer NOT NULL,
    "description" "text" NOT NULL,
    "cost_code_id" "text",
    "scheduled_value" numeric(15,2) DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."sov_line_items" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."sov_line_items_with_percentage" AS
 SELECT "sli"."id",
    "sli"."sov_id",
    "sli"."line_number",
    "sli"."description",
    "sli"."cost_code_id",
    "sli"."scheduled_value",
    "sli"."created_at",
    "sli"."updated_at",
        CASE
            WHEN ("sov"."total_amount" > (0)::numeric) THEN "round"((("sli"."scheduled_value" / "sov"."total_amount") * (100)::numeric), 2)
            ELSE (0)::numeric
        END AS "percentage"
   FROM ("public"."sov_line_items" "sli"
     JOIN "public"."schedule_of_values" "sov" ON (("sov"."id" = "sli"."sov_id")));


ALTER VIEW "public"."sov_line_items_with_percentage" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."specifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" integer NOT NULL,
    "section_number" character varying(50) NOT NULL,
    "section_title" character varying(255) NOT NULL,
    "division" character varying(50),
    "specification_type" character varying(50) DEFAULT 'csi'::character varying,
    "document_url" "text",
    "content" "text",
    "requirements" "jsonb",
    "keywords" "text"[],
    "ai_summary" "text",
    "version" character varying(50) DEFAULT '1.0'::character varying,
    "status" character varying(50) DEFAULT 'active'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "specifications_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['draft'::character varying, 'active'::character varying, 'superseded'::character varying, 'archived'::character varying])::"text"[])))
);


ALTER TABLE "public"."specifications" OWNER TO "postgres";


COMMENT ON TABLE "public"."specifications" IS 'Project specifications with AI-extracted requirements and keywords';



CREATE TABLE IF NOT EXISTS "public"."sub_jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint NOT NULL,
    "code" character varying(50) NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."sub_jobs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subcontractor_contacts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "subcontractor_id" "uuid",
    "name" "text" NOT NULL,
    "title" "text",
    "email" "text",
    "phone" "text",
    "mobile_phone" "text",
    "contact_type" "text",
    "is_primary" boolean DEFAULT false,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "subcontractor_contacts_contact_type_check" CHECK (("contact_type" = ANY (ARRAY['primary'::"text", 'secondary'::"text", 'project_manager'::"text", 'estimator'::"text", 'safety'::"text", 'billing'::"text"])))
);


ALTER TABLE "public"."subcontractor_contacts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subcontractor_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "subcontractor_id" "uuid",
    "document_type" "text" NOT NULL,
    "document_name" "text" NOT NULL,
    "file_url" "text",
    "expiration_date" "date",
    "is_current" boolean DEFAULT true,
    "uploaded_at" timestamp with time zone DEFAULT "now"(),
    "uploaded_by" "uuid",
    CONSTRAINT "subcontractor_documents_document_type_check" CHECK (("document_type" = ANY (ARRAY['insurance_certificate'::"text", 'license'::"text", 'w9'::"text", 'master_agreement'::"text", 'safety_manual'::"text", 'quality_certificate'::"text", 'reference_letter'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."subcontractor_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subcontractor_projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "subcontractor_id" "uuid",
    "project_name" "text" NOT NULL,
    "project_value" numeric(12,2),
    "start_date" "date",
    "completion_date" "date",
    "project_rating" numeric(3,2),
    "on_time" boolean,
    "on_budget" boolean,
    "safety_incidents" integer DEFAULT 0,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "subcontractor_projects_project_rating_check" CHECK ((("project_rating" >= (0)::numeric) AND ("project_rating" <= (5)::numeric)))
);


ALTER TABLE "public"."subcontractor_projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subcontractors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_name" "text" NOT NULL,
    "legal_business_name" "text",
    "dba_name" "text",
    "company_type" "text",
    "tax_id" "text",
    "primary_contact_name" "text" NOT NULL,
    "primary_contact_title" "text",
    "primary_contact_email" "text",
    "primary_contact_phone" "text",
    "secondary_contact_name" "text",
    "secondary_contact_email" "text",
    "secondary_contact_phone" "text",
    "address_line_1" "text",
    "address_line_2" "text",
    "city" "text",
    "state_province" "text",
    "postal_code" "text",
    "country" "text" DEFAULT 'United States'::"text",
    "specialties" "text"[],
    "service_areas" "text"[],
    "years_in_business" integer,
    "employee_count" integer,
    "annual_revenue_range" "text",
    "asrs_experience_years" integer,
    "fm_global_certified" boolean DEFAULT false,
    "nfpa_certifications" "text"[],
    "sprinkler_contractor_license" "text",
    "license_expiration_date" "date",
    "max_project_size" "text",
    "concurrent_projects_capacity" integer,
    "preferred_project_types" "text"[],
    "insurance_general_liability" numeric(12,2),
    "insurance_professional_liability" numeric(12,2),
    "insurance_workers_comp" boolean DEFAULT false,
    "bonding_capacity" numeric(12,2),
    "credit_rating" "text",
    "alleato_projects_completed" integer DEFAULT 0,
    "avg_project_rating" numeric(3,2),
    "on_time_completion_rate" numeric(5,2),
    "safety_incident_rate" numeric(5,2),
    "preferred_payment_terms" "text",
    "markup_percentage" numeric(5,2),
    "hourly_rates_range" "text",
    "travel_radius_miles" integer,
    "project_management_software" "text"[],
    "cad_software_proficiency" "text"[],
    "bim_capabilities" boolean DEFAULT false,
    "digital_collaboration_tools" "text"[],
    "osha_training_current" boolean DEFAULT false,
    "drug_testing_program" boolean DEFAULT false,
    "background_check_policy" boolean DEFAULT false,
    "quality_certifications" "text"[],
    "status" "text" DEFAULT 'active'::"text",
    "tier_level" "text",
    "preferred_vendor" boolean DEFAULT false,
    "master_agreement_signed" boolean DEFAULT false,
    "master_agreement_date" "date",
    "internal_notes" "text",
    "strengths" "text"[],
    "weaknesses" "text"[],
    "special_requirements" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    "updated_by" "uuid",
    "emergency_contact_name" "text",
    "emergency_contact_phone" "text",
    "emergency_contact_relationship" "text",
    CONSTRAINT "subcontractors_annual_revenue_range_check" CHECK (("annual_revenue_range" = ANY (ARRAY['under_1m'::"text", '1m_5m'::"text", '5m_10m'::"text", '10m_25m'::"text", '25m_plus'::"text"]))),
    CONSTRAINT "subcontractors_avg_project_rating_check" CHECK ((("avg_project_rating" >= (0)::numeric) AND ("avg_project_rating" <= (5)::numeric))),
    CONSTRAINT "subcontractors_company_type_check" CHECK (("company_type" = ANY (ARRAY['corporation'::"text", 'llc'::"text", 'partnership'::"text", 'sole_proprietorship'::"text", 'other'::"text"]))),
    CONSTRAINT "subcontractors_credit_rating_check" CHECK (("credit_rating" = ANY (ARRAY['excellent'::"text", 'good'::"text", 'fair'::"text", 'poor'::"text", 'unknown'::"text"]))),
    CONSTRAINT "subcontractors_max_project_size_check" CHECK (("max_project_size" = ANY (ARRAY['under_100k'::"text", '100k_500k'::"text", '500k_1m'::"text", '1m_5m'::"text", '5m_plus'::"text"]))),
    CONSTRAINT "subcontractors_on_time_completion_rate_check" CHECK ((("on_time_completion_rate" >= (0)::numeric) AND ("on_time_completion_rate" <= (100)::numeric))),
    CONSTRAINT "subcontractors_preferred_payment_terms_check" CHECK (("preferred_payment_terms" = ANY (ARRAY['net_15'::"text", 'net_30'::"text", 'net_45'::"text", 'net_60'::"text", 'progress_billing'::"text"]))),
    CONSTRAINT "subcontractors_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'pending_approval'::"text", 'blacklisted'::"text"]))),
    CONSTRAINT "subcontractors_tier_level_check" CHECK (("tier_level" = ANY (ARRAY['platinum'::"text", 'gold'::"text", 'silver'::"text", 'bronze'::"text", 'unrated'::"text"])))
);


ALTER TABLE "public"."subcontractors" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."subcontractors_summary" AS
 SELECT "s"."id",
    "s"."company_name",
    "s"."primary_contact_name",
    "s"."primary_contact_email",
    "s"."specialties",
    "s"."service_areas",
    "s"."fm_global_certified",
    "s"."asrs_experience_years",
    "s"."status",
    "s"."tier_level",
    "count"("sp"."id") AS "total_projects",
    "avg"("sp"."project_rating") AS "avg_rating",
    ((("sum"(
        CASE
            WHEN "sp"."on_time" THEN 1
            ELSE 0
        END))::numeric / ("count"("sp"."id"))::numeric) * (100)::numeric) AS "on_time_percentage"
   FROM ("public"."subcontractors" "s"
     LEFT JOIN "public"."subcontractor_projects" "sp" ON (("s"."id" = "sp"."subcontractor_id")))
  GROUP BY "s"."id", "s"."company_name", "s"."primary_contact_name", "s"."primary_contact_email", "s"."specialties", "s"."service_areas", "s"."fm_global_certified", "s"."asrs_experience_years", "s"."status", "s"."tier_level";


ALTER VIEW "public"."subcontractors_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submittal_analytics_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_type" character varying(100) NOT NULL,
    "project_id" integer,
    "submittal_id" "uuid",
    "user_id" "uuid",
    "event_data" "jsonb",
    "session_id" character varying(255),
    "ip_address" "inet",
    "user_agent" "text",
    "occurred_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."submittal_analytics_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submittal_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "submittal_id" "uuid" NOT NULL,
    "document_name" character varying(255) NOT NULL,
    "document_type" character varying(100),
    "file_url" "text" NOT NULL,
    "file_size_bytes" bigint,
    "mime_type" character varying(100),
    "page_count" integer,
    "extracted_text" "text",
    "ai_analysis" "jsonb",
    "version" integer DEFAULT 1,
    "uploaded_at" timestamp with time zone DEFAULT "now"(),
    "uploaded_by" "uuid" NOT NULL
);


ALTER TABLE "public"."submittal_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submittal_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "submittal_id" "uuid" NOT NULL,
    "action" character varying(100) NOT NULL,
    "actor_id" "uuid",
    "actor_type" character varying(50) DEFAULT 'user'::character varying,
    "description" "text",
    "previous_status" character varying(50),
    "new_status" character varying(50),
    "changes" "jsonb",
    "metadata" "jsonb",
    "occurred_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."submittal_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submittal_notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "project_id" integer,
    "submittal_id" "uuid",
    "notification_type" character varying(100) NOT NULL,
    "title" character varying(255) NOT NULL,
    "message" "text",
    "priority" character varying(50) DEFAULT 'normal'::character varying,
    "is_read" boolean DEFAULT false,
    "delivery_methods" "text"[] DEFAULT ARRAY['in_app'::"text"],
    "scheduled_for" timestamp with time zone DEFAULT "now"(),
    "sent_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "submittal_notifications_priority_check" CHECK ((("priority")::"text" = ANY ((ARRAY['low'::character varying, 'normal'::character varying, 'high'::character varying, 'urgent'::character varying])::"text"[])))
);


ALTER TABLE "public"."submittal_notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submittal_performance_metrics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" integer,
    "metric_type" character varying(100) NOT NULL,
    "metric_name" character varying(255) NOT NULL,
    "value" numeric(10,4),
    "unit" character varying(50),
    "period_start" timestamp with time zone,
    "period_end" timestamp with time zone,
    "metadata" "jsonb",
    "calculated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."submittal_performance_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submittals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" integer NOT NULL,
    "specification_id" "uuid",
    "submittal_type_id" "uuid" NOT NULL,
    "submittal_number" character varying(100) NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "submitted_by" "uuid" NOT NULL,
    "submitter_company" character varying(255),
    "submission_date" timestamp with time zone DEFAULT "now"(),
    "required_approval_date" "date",
    "priority" character varying(50) DEFAULT 'normal'::character varying,
    "status" character varying(50) DEFAULT 'submitted'::character varying,
    "current_version" integer DEFAULT 1,
    "total_versions" integer DEFAULT 1,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "submittals_priority_check" CHECK ((("priority")::"text" = ANY ((ARRAY['low'::character varying, 'normal'::character varying, 'high'::character varying, 'critical'::character varying])::"text"[]))),
    CONSTRAINT "submittals_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['draft'::character varying, 'submitted'::character varying, 'under_review'::character varying, 'requires_revision'::character varying, 'approved'::character varying, 'rejected'::character varying, 'superseded'::character varying])::"text"[])))
);


ALTER TABLE "public"."submittals" OWNER TO "postgres";


COMMENT ON TABLE "public"."submittals" IS 'Main table for construction submittals with AI-powered workflow management';



CREATE OR REPLACE VIEW "public"."submittal_project_dashboard" AS
 SELECT "p"."id",
    "p"."name",
    "p"."state" AS "status",
    "count"("s"."id") AS "total_submittals",
    "count"(
        CASE
            WHEN (("s"."status")::"text" = 'submitted'::"text") THEN 1
            ELSE NULL::integer
        END) AS "pending_submittals",
    "count"(
        CASE
            WHEN (("s"."status")::"text" = 'under_review'::"text") THEN 1
            ELSE NULL::integer
        END) AS "under_review",
    "count"(
        CASE
            WHEN (("s"."status")::"text" = 'approved'::"text") THEN 1
            ELSE NULL::integer
        END) AS "approved_submittals",
    "count"(
        CASE
            WHEN (("s"."status")::"text" = 'requires_revision'::"text") THEN 1
            ELSE NULL::integer
        END) AS "needs_revision",
    "count"("d"."id") AS "total_discrepancies",
    "count"(
        CASE
            WHEN (("d"."severity")::"text" = 'critical'::"text") THEN 1
            ELSE NULL::integer
        END) AS "critical_discrepancies",
    "avg"(EXTRACT(days FROM (COALESCE("r"."completed_at", "now"()) - "s"."submission_date"))) AS "avg_review_time_days"
   FROM ((("public"."projects" "p"
     LEFT JOIN "public"."submittals" "s" ON (("p"."id" = "s"."project_id")))
     LEFT JOIN "public"."discrepancies" "d" ON ((("s"."id" = "d"."submittal_id") AND (("d"."status")::"text" = 'open'::"text"))))
     LEFT JOIN "public"."reviews" "r" ON ((("s"."id" = "r"."submittal_id") AND (("r"."review_type")::"text" = 'final'::"text"))))
  GROUP BY "p"."id", "p"."name", "p"."state";


ALTER VIEW "public"."submittal_project_dashboard" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submittal_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "category" character varying(100) NOT NULL,
    "description" "text",
    "required_documents" "text"[],
    "review_criteria" "jsonb",
    "ai_analysis_config" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."submittal_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sync_status" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "sync_type" "text" DEFAULT 'fireflies'::"text" NOT NULL,
    "last_sync_at" timestamp with time zone,
    "last_successful_sync_at" timestamp with time zone,
    "status" "text" DEFAULT 'idle'::"text",
    "error_message" "text",
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "sync_status_status_check" CHECK (("status" = ANY (ARRAY['idle'::"text", 'running'::"text", 'failed'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."sync_status" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tasks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "metadata_id" "text" NOT NULL,
    "segment_id" "uuid",
    "source_chunk_id" "uuid",
    "description" "text" NOT NULL,
    "assignee_name" "text",
    "assignee_email" "text",
    "project_id" bigint,
    "client_id" bigint,
    "due_date" "date",
    "priority" "text",
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "source_system" "text" DEFAULT 'fireflies'::"text" NOT NULL,
    "embedding" "public"."vector"(1536),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "project_ids" integer[] DEFAULT '{}'::integer[],
    CONSTRAINT "tasks_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'urgent'::"text"]))),
    CONSTRAINT "tasks_status_check" CHECK (("status" = ANY (ARRAY['open'::"text", 'in_progress'::"text", 'blocked'::"text", 'done'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."tasks" OWNER TO "postgres";


COMMENT ON COLUMN "public"."tasks"."project_ids" IS 'Array of project IDs this task relates to. Allows tasks to span multiple projects.';



CREATE TABLE IF NOT EXISTS "public"."todos" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "task" "text",
    "is_complete" boolean DEFAULT false,
    "inserted_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "todos_task_check" CHECK (("char_length"("task") > 3))
);


ALTER TABLE "public"."todos" OWNER TO "postgres";


ALTER TABLE "public"."todos" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."todos_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "is_admin" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "role" "text" DEFAULT 'team'::"text"
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_email" character varying(255),
    "project_name" "text",
    "company_name" "text",
    "contact_phone" character varying(50),
    "project_data" "jsonb" NOT NULL,
    "lead_score" integer DEFAULT 0,
    "status" character varying(50) DEFAULT 'new'::character varying,
    "estimated_value" numeric(12,2),
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."user_projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" character varying(64) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_budget_grand_totals" AS
 SELECT "project_id",
    "sum"("original_budget_amount") AS "original_budget_amount",
    "sum"("budget_modifications") AS "budget_modifications",
    "sum"("approved_cos") AS "approved_cos",
    "sum"("revised_budget") AS "revised_budget",
    "sum"("job_to_date_cost") AS "job_to_date_cost",
    "sum"("direct_costs") AS "direct_costs",
    "sum"("pending_budget_changes") AS "pending_budget_changes",
    "sum"("projected_budget") AS "projected_budget",
    "sum"("committed_costs") AS "committed_costs",
    "sum"("pending_cost_changes") AS "pending_cost_changes",
    "sum"("projected_costs") AS "projected_costs",
    "sum"("forecast_to_complete") AS "forecast_to_complete",
    "sum"("estimated_cost_at_completion") AS "estimated_cost_at_completion",
    "sum"("projected_over_under") AS "projected_over_under"
   FROM "public"."v_budget_rollup"
  GROUP BY "project_id";


ALTER VIEW "public"."v_budget_grand_totals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vertical_markup" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" bigint,
    "markup_type" "text" NOT NULL,
    "percentage" numeric(5,2) NOT NULL,
    "calculation_order" integer NOT NULL,
    "compound" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "vertical_markup_markup_type_check" CHECK (("markup_type" = ANY (ARRAY['insurance'::"text", 'bond'::"text", 'fee'::"text", 'overhead'::"text", 'custom'::"text"]))),
    CONSTRAINT "vertical_markup_percentage_check" CHECK ((("percentage" >= (0)::numeric) AND ("percentage" <= (100)::numeric)))
);


ALTER TABLE "public"."vertical_markup" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_budget_with_markup" AS
 WITH "project_markups" AS (
         SELECT "vertical_markup"."project_id",
            "jsonb_agg"("jsonb_build_object"('markup_type', "vertical_markup"."markup_type", 'percentage', "vertical_markup"."percentage", 'compound', "vertical_markup"."compound", 'calculation_order', "vertical_markup"."calculation_order") ORDER BY "vertical_markup"."calculation_order") AS "markups"
           FROM "public"."vertical_markup"
          GROUP BY "vertical_markup"."project_id"
        )
 SELECT "br"."budget_code_id",
    "br"."project_id",
    "br"."sub_job_id",
    "br"."cost_code_id",
    "br"."cost_type_id",
    "br"."budget_code_description",
    "br"."cost_code_description",
    "br"."cost_code_division",
    "br"."division_title",
    "br"."cost_type_code",
    "br"."cost_type_description",
    "br"."position",
    "br"."original_budget_amount",
    "br"."budget_modifications",
    "br"."approved_cos",
    "br"."revised_budget",
    "br"."job_to_date_cost",
    "br"."direct_costs",
    "br"."pending_budget_changes",
    "br"."projected_budget",
    "br"."committed_costs",
    "br"."pending_cost_changes",
    "br"."projected_costs",
    "br"."forecast_to_complete",
    "br"."estimated_cost_at_completion",
    "br"."projected_over_under",
    "pm"."markups"
   FROM ("public"."v_budget_rollup" "br"
     LEFT JOIN "project_markups" "pm" ON (("br"."project_id" = "pm"."project_id")));


ALTER VIEW "public"."v_budget_with_markup" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "vecs"."mem0_memories" (
    "id" character varying NOT NULL,
    "vec" "public"."vector"(1536) NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);


ALTER TABLE "vecs"."mem0_memories" OWNER TO "postgres";


ALTER TABLE ONLY "drizzle"."__drizzle_migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"drizzle"."__drizzle_migrations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."archon_code_examples" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."archon_code_examples_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."archon_crawled_pages" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."archon_crawled_pages_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."change_order_approvals" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."change_order_approvals_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."change_order_costs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."change_order_costs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."change_order_lines" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."change_order_lines_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."change_orders" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."change_orders_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."code_examples" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."code_examples_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."crawled_pages" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."crawled_pages_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."document_executive_summaries" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."document_executive_summaries_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."document_rows" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."document_rows_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."initiatives" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."initiatives_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."issues" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."issues_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."memories" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."memories_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."nods_page" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."nods_page_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."nods_page_section" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."nods_page_section_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."optimization_rules" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."optimization_rules_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."prospects" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."prospects_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."qto_items" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."qto_items_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."qtos" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."qtos_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."schedule_progress_updates" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."schedule_progress_updates_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."schedule_resources" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."schedule_resources_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."schedule_task_dependencies" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."schedule_task_dependencies_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."schedule_tasks" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."schedule_tasks_id_seq"'::"regclass");



ALTER TABLE ONLY "drizzle"."__drizzle_migrations"
    ADD CONSTRAINT "__drizzle_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "next_auth"."users"
    ADD CONSTRAINT "email_unique" UNIQUE ("email");



ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "provider_unique" UNIQUE ("provider", "providerAccountId");



ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessiontoken_unique" UNIQUE ("sessionToken");



ALTER TABLE ONLY "next_auth"."verification_tokens"
    ADD CONSTRAINT "token_identifier_unique" UNIQUE ("token", "identifier");



ALTER TABLE ONLY "next_auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "next_auth"."verification_tokens"
    ADD CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("token");



ALTER TABLE ONLY "private"."document_processing_queue"
    ADD CONSTRAINT "document_processing_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Prospects"
    ADD CONSTRAINT "Prospects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."__drizzle_migrations"
    ADD CONSTRAINT "__drizzle_migrations_pkey" PRIMARY KEY ("hash");



ALTER TABLE ONLY "public"."ai_analysis_jobs"
    ADD CONSTRAINT "ai_analysis_jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_insights"
    ADD CONSTRAINT "ai_insights_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."ai_insights"
    ADD CONSTRAINT "ai_insights_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_models"
    ADD CONSTRAINT "ai_models_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."ai_models"
    ADD CONSTRAINT "ai_models_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_tasks"
    ADD CONSTRAINT "ai_tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."app_users"
    ADD CONSTRAINT "app_users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."app_users"
    ADD CONSTRAINT "app_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."archon_code_examples"
    ADD CONSTRAINT "archon_code_examples_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."archon_code_examples"
    ADD CONSTRAINT "archon_code_examples_url_chunk_number_key" UNIQUE ("url", "chunk_number");



ALTER TABLE ONLY "public"."archon_crawled_pages"
    ADD CONSTRAINT "archon_crawled_pages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."archon_crawled_pages"
    ADD CONSTRAINT "archon_crawled_pages_url_chunk_number_key" UNIQUE ("url", "chunk_number");



ALTER TABLE ONLY "public"."archon_document_versions"
    ADD CONSTRAINT "archon_document_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."archon_document_versions"
    ADD CONSTRAINT "archon_document_versions_project_id_task_id_field_name_vers_key" UNIQUE ("project_id", "task_id", "field_name", "version_number");



ALTER TABLE ONLY "public"."archon_project_sources"
    ADD CONSTRAINT "archon_project_sources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."archon_project_sources"
    ADD CONSTRAINT "archon_project_sources_project_id_source_id_key" UNIQUE ("project_id", "source_id");



ALTER TABLE ONLY "public"."archon_projects"
    ADD CONSTRAINT "archon_projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."archon_prompts"
    ADD CONSTRAINT "archon_prompts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."archon_prompts"
    ADD CONSTRAINT "archon_prompts_prompt_name_key" UNIQUE ("prompt_name");



ALTER TABLE ONLY "public"."archon_settings"
    ADD CONSTRAINT "archon_settings_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."archon_settings"
    ADD CONSTRAINT "archon_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."archon_sources"
    ADD CONSTRAINT "archon_sources_pkey" PRIMARY KEY ("source_id");



ALTER TABLE ONLY "public"."archon_tasks"
    ADD CONSTRAINT "archon_tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."asrs_blocks"
    ADD CONSTRAINT "asrs_blocks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."asrs_configurations"
    ADD CONSTRAINT "asrs_configurations_config_name_key" UNIQUE ("config_name");



ALTER TABLE ONLY "public"."asrs_configurations"
    ADD CONSTRAINT "asrs_configurations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."asrs_decision_matrix"
    ADD CONSTRAINT "asrs_decision_matrix_asrs_type_container_type_max_depth_ft__key" UNIQUE ("asrs_type", "container_type", "max_depth_ft", "max_spacing_ft");



ALTER TABLE ONLY "public"."asrs_decision_matrix"
    ADD CONSTRAINT "asrs_decision_matrix_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."asrs_logic_cards"
    ADD CONSTRAINT "asrs_logic_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."asrs_protection_rules"
    ADD CONSTRAINT "asrs_protection_rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."asrs_sections"
    ADD CONSTRAINT "asrs_sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."asrs_sections"
    ADD CONSTRAINT "asrs_sections_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."attachments"
    ADD CONSTRAINT "attachments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."billing_periods"
    ADD CONSTRAINT "billing_periods_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."billing_periods"
    ADD CONSTRAINT "billing_periods_project_id_period_number_key" UNIQUE ("project_id", "period_number");



ALTER TABLE ONLY "public"."block_embeddings"
    ADD CONSTRAINT "block_embeddings_pkey" PRIMARY KEY ("block_id");



ALTER TABLE ONLY "public"."briefing_runs"
    ADD CONSTRAINT "briefing_runs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."budget_codes"
    ADD CONSTRAINT "budget_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."budget_items"
    ADD CONSTRAINT "budget_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."budget_line_items"
    ADD CONSTRAINT "budget_line_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."budget_modifications"
    ADD CONSTRAINT "budget_modifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."budget_snapshots"
    ADD CONSTRAINT "budget_snapshots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."change_event_line_items"
    ADD CONSTRAINT "change_event_line_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."change_events"
    ADD CONSTRAINT "change_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."change_order_approvals"
    ADD CONSTRAINT "change_order_approvals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."change_order_costs"
    ADD CONSTRAINT "change_order_costs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."change_order_line_items"
    ADD CONSTRAINT "change_order_line_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."change_order_lines"
    ADD CONSTRAINT "change_order_lines_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."change_orders"
    ADD CONSTRAINT "change_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_history"
    ADD CONSTRAINT "chat_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_sessions"
    ADD CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_thread_attachment_files"
    ADD CONSTRAINT "chat_thread_attachment_files_pkey" PRIMARY KEY ("attachment_id");



ALTER TABLE ONLY "public"."chat_thread_attachments"
    ADD CONSTRAINT "chat_thread_attachments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_thread_feedback"
    ADD CONSTRAINT "chat_thread_feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_thread_items"
    ADD CONSTRAINT "chat_thread_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_threads"
    ADD CONSTRAINT "chat_threads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chunks"
    ADD CONSTRAINT "chunks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."code_examples"
    ADD CONSTRAINT "code_examples_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."code_examples"
    ADD CONSTRAINT "code_examples_url_chunk_number_key" UNIQUE ("url", "chunk_number");



ALTER TABLE ONLY "public"."commitment_changes"
    ADD CONSTRAINT "commitment_changes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."commitments"
    ADD CONSTRAINT "commitments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_context"
    ADD CONSTRAINT "company_context_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("session_id");



ALTER TABLE ONLY "public"."cost_code_division_updates_audit"
    ADD CONSTRAINT "cost_code_division_updates_audit_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cost_code_types"
    ADD CONSTRAINT "cost_code_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cost_codes"
    ADD CONSTRAINT "cost_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cost_factors"
    ADD CONSTRAINT "cost_factors_factor_name_key" UNIQUE ("factor_name");



ALTER TABLE ONLY "public"."cost_factors"
    ADD CONSTRAINT "cost_factors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cost_forecasts"
    ADD CONSTRAINT "cost_forecasts_budget_item_id_forecast_date_key" UNIQUE ("budget_item_id", "forecast_date");



ALTER TABLE ONLY "public"."cost_forecasts"
    ADD CONSTRAINT "cost_forecasts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."crawled_pages"
    ADD CONSTRAINT "crawled_pages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."crawled_pages"
    ADD CONSTRAINT "crawled_pages_url_chunk_number_key" UNIQUE ("url", "chunk_number");



ALTER TABLE ONLY "public"."daily_log_equipment"
    ADD CONSTRAINT "daily_log_equipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_log_manpower"
    ADD CONSTRAINT "daily_log_manpower_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_log_notes"
    ADD CONSTRAINT "daily_log_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_logs"
    ADD CONSTRAINT "daily_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_logs"
    ADD CONSTRAINT "daily_logs_project_id_log_date_key" UNIQUE ("project_id", "log_date");



ALTER TABLE ONLY "public"."daily_recaps"
    ADD CONSTRAINT "daily_recaps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."decisions"
    ADD CONSTRAINT "decisions_metadata_id_description_key" UNIQUE ("metadata_id", "description");



ALTER TABLE ONLY "public"."decisions"
    ADD CONSTRAINT "decisions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."design_recommendations"
    ADD CONSTRAINT "design_recommendations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."direct_cost_line_items"
    ADD CONSTRAINT "direct_cost_line_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."direct_costs"
    ADD CONSTRAINT "direct_costs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."discrepancies"
    ADD CONSTRAINT "discrepancies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cost_code_divisions"
    ADD CONSTRAINT "divisions_code_unique" UNIQUE ("code");



ALTER TABLE ONLY "public"."cost_code_divisions"
    ADD CONSTRAINT "divisions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_chunks"
    ADD CONSTRAINT "document_chunks_document_id_chunk_index_key" UNIQUE ("document_id", "chunk_index");



ALTER TABLE ONLY "public"."document_chunks"
    ADD CONSTRAINT "document_chunks_pkey" PRIMARY KEY ("chunk_id");



ALTER TABLE ONLY "public"."document_executive_summaries"
    ADD CONSTRAINT "document_executive_summaries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_group_access"
    ADD CONSTRAINT "document_group_access_pkey" PRIMARY KEY ("document_id", "group_id");



ALTER TABLE ONLY "public"."document_insights"
    ADD CONSTRAINT "document_insights_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_metadata"
    ADD CONSTRAINT "document_metadata_file_id_key" UNIQUE ("file_id");



ALTER TABLE ONLY "public"."document_metadata"
    ADD CONSTRAINT "document_metadata_fireflies_id_unique" UNIQUE ("fireflies_id");



ALTER TABLE ONLY "public"."document_metadata"
    ADD CONSTRAINT "document_metadata_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_rows"
    ADD CONSTRAINT "document_rows_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_user_access"
    ADD CONSTRAINT "document_user_access_pkey" PRIMARY KEY ("document_id", "user_id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."erp_sync_log"
    ADD CONSTRAINT "erp_sync_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."financial_contracts"
    ADD CONSTRAINT "financial_contracts_contract_number_key" UNIQUE ("contract_number");



ALTER TABLE ONLY "public"."financial_contracts"
    ADD CONSTRAINT "financial_contracts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fireflies_ingestion_jobs"
    ADD CONSTRAINT "fireflies_ingestion_jobs_fireflies_id_key" UNIQUE ("fireflies_id");



ALTER TABLE ONLY "public"."fireflies_ingestion_jobs"
    ADD CONSTRAINT "fireflies_ingestion_jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fm_blocks"
    ADD CONSTRAINT "fm_blocks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fm_cost_factors"
    ADD CONSTRAINT "fm_cost_factors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fm_documents"
    ADD CONSTRAINT "fm_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fm_form_submissions"
    ADD CONSTRAINT "fm_form_submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fm_global_figures"
    ADD CONSTRAINT "fm_global_figures_figure_number_key" UNIQUE ("figure_number");



ALTER TABLE ONLY "public"."fm_global_figures"
    ADD CONSTRAINT "fm_global_figures_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fm_global_tables"
    ADD CONSTRAINT "fm_global_tables_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fm_global_tables"
    ADD CONSTRAINT "fm_global_tables_table_id_key" UNIQUE ("table_id");



ALTER TABLE ONLY "public"."fm_optimization_rules"
    ADD CONSTRAINT "fm_optimization_rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fm_optimization_suggestions"
    ADD CONSTRAINT "fm_optimization_suggestions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fm_sections"
    ADD CONSTRAINT "fm_sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fm_sections"
    ADD CONSTRAINT "fm_sections_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."fm_sprinkler_configs"
    ADD CONSTRAINT "fm_sprinkler_configs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fm_table_vectors"
    ADD CONSTRAINT "fm_table_vectors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fm_text_chunks"
    ADD CONSTRAINT "fm_text_chunks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forecasting"
    ADD CONSTRAINT "forecasting_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("group_id", "user_id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ingestion_jobs"
    ADD CONSTRAINT "ingestion_jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."initiatives"
    ADD CONSTRAINT "initiatives_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."initiatives"
    ADD CONSTRAINT "initiatives_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."issues"
    ADD CONSTRAINT "issues_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."meeting_segments"
    ADD CONSTRAINT "meeting_segments_metadata_id_segment_index_key" UNIQUE ("metadata_id", "segment_index");



ALTER TABLE ONLY "public"."meeting_segments"
    ADD CONSTRAINT "meeting_segments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."memories"
    ADD CONSTRAINT "memories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nods_page"
    ADD CONSTRAINT "nods_page_path_key" UNIQUE ("path");



ALTER TABLE ONLY "public"."nods_page"
    ADD CONSTRAINT "nods_page_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nods_page_section"
    ADD CONSTRAINT "nods_page_section_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."opportunities"
    ADD CONSTRAINT "opportunities_metadata_id_description_key" UNIQUE ("metadata_id", "description");



ALTER TABLE ONLY "public"."opportunities"
    ADD CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."optimization_rules"
    ADD CONSTRAINT "optimization_rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."owner_invoice_line_items"
    ADD CONSTRAINT "owner_invoice_line_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."owner_invoices"
    ADD CONSTRAINT "owner_invoices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."parts"
    ADD CONSTRAINT "parts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_transactions"
    ADD CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pcco_line_items"
    ADD CONSTRAINT "pcco_line_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pco_line_items"
    ADD CONSTRAINT "pco_line_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pending_budget_changes"
    ADD CONSTRAINT "pending_budget_changes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."prime_contract_change_orders"
    ADD CONSTRAINT "prime_contract_change_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."prime_contract_sovs"
    ADD CONSTRAINT "prime_contract_sovs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."prime_potential_change_orders"
    ADD CONSTRAINT "prime_potential_change_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."processing_queue"
    ADD CONSTRAINT "processing_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."procore_capture_sessions"
    ADD CONSTRAINT "procore_capture_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."procore_components"
    ADD CONSTRAINT "procore_components_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."procore_features"
    ADD CONSTRAINT "procore_features_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."procore_modules"
    ADD CONSTRAINT "procore_modules_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."procore_modules"
    ADD CONSTRAINT "procore_modules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."procore_screenshots"
    ADD CONSTRAINT "procore_screenshots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."project_briefings"
    ADD CONSTRAINT "project_briefings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_cost_codes"
    ADD CONSTRAINT "project_cost_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_directory"
    ADD CONSTRAINT "project_directory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_directory"
    ADD CONSTRAINT "project_directory_project_id_company_id_role_key" UNIQUE ("project_id", "company_id", "role");



ALTER TABLE ONLY "public"."project_insights"
    ADD CONSTRAINT "project_insights_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_members"
    ADD CONSTRAINT "project_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_members"
    ADD CONSTRAINT "project_members_project_id_user_id_key" UNIQUE ("project_id", "user_id");



ALTER TABLE ONLY "public"."project_resources"
    ADD CONSTRAINT "project_resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_tasks"
    ADD CONSTRAINT "project_tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_users"
    ADD CONSTRAINT "project_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_users"
    ADD CONSTRAINT "project_users_project_id_user_id_key" UNIQUE ("project_id", "user_id");



ALTER TABLE ONLY "public"."projects_audit"
    ADD CONSTRAINT "projects_audit_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."prospects"
    ADD CONSTRAINT "prospects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."qto_items"
    ADD CONSTRAINT "qto_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."qtos"
    ADD CONSTRAINT "qtos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rag_pipeline_state"
    ADD CONSTRAINT "rag_pipeline_state_pkey" PRIMARY KEY ("pipeline_id");



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."review_comments"
    ADD CONSTRAINT "review_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rfi_assignees"
    ADD CONSTRAINT "rfi_assignees_pkey" PRIMARY KEY ("rfi_id", "employee_id");



ALTER TABLE ONLY "public"."rfis"
    ADD CONSTRAINT "rfis_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."risks"
    ADD CONSTRAINT "risks_metadata_id_description_key" UNIQUE ("metadata_id", "description");



ALTER TABLE ONLY "public"."risks"
    ADD CONSTRAINT "risks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schedule_of_values"
    ADD CONSTRAINT "schedule_of_values_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schedule_progress_updates"
    ADD CONSTRAINT "schedule_progress_updates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schedule_resources"
    ADD CONSTRAINT "schedule_resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schedule_task_dependencies"
    ADD CONSTRAINT "schedule_task_dependencies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schedule_tasks"
    ADD CONSTRAINT "schedule_tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sources"
    ADD CONSTRAINT "sources_pkey" PRIMARY KEY ("source_id");



ALTER TABLE ONLY "public"."sov_line_items"
    ADD CONSTRAINT "sov_line_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."specifications"
    ADD CONSTRAINT "specifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sub_jobs"
    ADD CONSTRAINT "sub_jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subcontractor_contacts"
    ADD CONSTRAINT "subcontractor_contacts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subcontractor_documents"
    ADD CONSTRAINT "subcontractor_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subcontractor_projects"
    ADD CONSTRAINT "subcontractor_projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subcontractors"
    ADD CONSTRAINT "subcontractors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."submittal_analytics_events"
    ADD CONSTRAINT "submittal_analytics_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."submittal_documents"
    ADD CONSTRAINT "submittal_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."submittal_history"
    ADD CONSTRAINT "submittal_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."submittal_notifications"
    ADD CONSTRAINT "submittal_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."submittal_performance_metrics"
    ADD CONSTRAINT "submittal_performance_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."submittal_types"
    ADD CONSTRAINT "submittal_types_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."submittal_types"
    ADD CONSTRAINT "submittal_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."submittals"
    ADD CONSTRAINT "submittals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."submittals"
    ADD CONSTRAINT "submittals_project_id_submittal_number_key" UNIQUE ("project_id", "submittal_number");



ALTER TABLE ONLY "public"."sync_status"
    ADD CONSTRAINT "sync_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_metadata_id_description_key" UNIQUE ("metadata_id", "description");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."todos"
    ADD CONSTRAINT "todos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_briefings"
    ADD CONSTRAINT "unique_latest_briefing" UNIQUE ("project_id", "version");



ALTER TABLE ONLY "public"."budget_snapshots"
    ADD CONSTRAINT "uq_snapshot_name" UNIQUE ("project_id", "snapshot_name");



ALTER TABLE ONLY "public"."sub_jobs"
    ADD CONSTRAINT "uq_subjob_code" UNIQUE ("project_id", "code");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_projects"
    ADD CONSTRAINT "user_projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vertical_markup"
    ADD CONSTRAINT "vertical_markup_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vertical_markup"
    ADD CONSTRAINT "vertical_markup_project_id_markup_type_key" UNIQUE ("project_id", "markup_type");



ALTER TABLE ONLY "vecs"."mem0_memories"
    ADD CONSTRAINT "mem0_memories_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_document_processing_queue_document_id" ON "private"."document_processing_queue" USING "btree" ("document_id");



CREATE INDEX "archon_code_examples_embedding_idx" ON "public"."archon_code_examples" USING "ivfflat" ("embedding" "public"."vector_cosine_ops");



CREATE INDEX "archon_crawled_pages_embedding_idx" ON "public"."archon_crawled_pages" USING "ivfflat" ("embedding" "public"."vector_cosine_ops");



CREATE INDEX "asrs_blocks_meta_gin" ON "public"."asrs_blocks" USING "gin" ("meta");



CREATE INDEX "asrs_blocks_section_idx" ON "public"."asrs_blocks" USING "btree" ("section_id");



CREATE INDEX "asrs_sections_number_idx" ON "public"."asrs_sections" USING "btree" ("number");



CREATE INDEX "block_embeddings_source_text_fts" ON "public"."asrs_blocks" USING "gin" ("to_tsvector"('"english"'::"regconfig", "source_text"));



CREATE INDEX "budget_items_cost_code_idx" ON "public"."budget_items" USING "btree" ("cost_code_id");



CREATE INDEX "budget_items_project_idx" ON "public"."budget_items" USING "btree" ("project_id");



CREATE INDEX "budget_modifications_item_idx" ON "public"."budget_modifications" USING "btree" ("budget_item_id");



CREATE INDEX "chat_messages_session_id_idx" ON "public"."chat_messages" USING "btree" ("session_id");



CREATE INDEX "chat_sessions_user_id_idx" ON "public"."chat_sessions" USING "btree" ("user_id");



CREATE INDEX "code_examples_embedding_idx" ON "public"."code_examples" USING "ivfflat" ("embedding" "public"."vector_cosine_ops");



CREATE INDEX "contract_financial_summary_mv_client_id" ON "public"."contract_financial_summary_mv" USING "btree" ("client_id");



CREATE INDEX "contract_financial_summary_mv_contract_id" ON "public"."contract_financial_summary_mv" USING "btree" ("contract_id");



CREATE INDEX "contract_financial_summary_mv_project_id" ON "public"."contract_financial_summary_mv" USING "btree" ("project_id");



CREATE INDEX "crawled_pages_embedding_idx" ON "public"."crawled_pages" USING "ivfflat" ("embedding" "public"."vector_cosine_ops");



CREATE INDEX "decisions_embedding_idx" ON "public"."decisions" USING "hnsw" ("embedding" "public"."vector_cosine_ops") WITH ("m"='16', "ef_construction"='64');



CREATE INDEX "decisions_project_ids_gin_idx" ON "public"."decisions" USING "gin" ("project_ids");



CREATE INDEX "document_chunks_embedding_idx" ON "public"."document_chunks" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='100');



CREATE INDEX "documents_project_ids_gin_idx" ON "public"."documents" USING "gin" ("project_ids");



CREATE INDEX "fireflies_ingestion_jobs_metadata_idx" ON "public"."fireflies_ingestion_jobs" USING "btree" ("metadata_id");



CREATE INDEX "fireflies_ingestion_jobs_stage_idx" ON "public"."fireflies_ingestion_jobs" USING "btree" ("stage");



CREATE INDEX "fm_documents_embedding_idx" ON "public"."fm_documents" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='50');



CREATE INDEX "fm_global_figures_claims_gin" ON "public"."fm_global_figures" USING "gin" ("machine_readable_claims");



CREATE INDEX "fm_global_figures_num_idx" ON "public"."fm_global_figures" USING "btree" ("figure_number");



CREATE INDEX "fm_global_tables_specs_gin" ON "public"."fm_global_tables" USING "gin" ("sprinkler_specifications");



CREATE INDEX "fm_global_tables_tableid_idx" ON "public"."fm_global_tables" USING "btree" ("table_id");



CREATE INDEX "fm_table_vectors_embedding_cosine_idx" ON "public"."fm_table_vectors" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='100');



CREATE INDEX "fm_table_vectors_embedding_idx" ON "public"."fm_table_vectors" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='100');



CREATE INDEX "fm_table_vectors_embedding_l2_idx" ON "public"."fm_table_vectors" USING "ivfflat" ("embedding") WITH ("lists"='100');



CREATE INDEX "idx_ai_analysis_results" ON "public"."ai_analysis_jobs" USING "gin" ("results");



CREATE INDEX "idx_ai_insights_assigned_to" ON "public"."ai_insights" USING "btree" ("assigned_to") WHERE ("assigned_to" IS NOT NULL);



CREATE INDEX "idx_ai_insights_chunks_id" ON "public"."ai_insights" USING "btree" ("chunks_id");



CREATE INDEX "idx_ai_insights_created_at" ON "public"."ai_insights" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_ai_insights_document_id" ON "public"."ai_insights" USING "btree" ("document_id");



CREATE INDEX "idx_ai_insights_due_date" ON "public"."ai_insights" USING "btree" ("due_date") WHERE ("due_date" IS NOT NULL);



CREATE INDEX "idx_ai_insights_exact_quotes_search" ON "public"."ai_insights" USING "gin" ("to_tsvector"('"english"'::"regconfig", COALESCE(("exact_quotes")::"text", ''::"text"))) WHERE ("exact_quotes" IS NOT NULL);



CREATE INDEX "idx_ai_insights_exact_quotes_tsv" ON "public"."ai_insights" USING "gin" ("to_tsvector"('"english"'::"regconfig", COALESCE("exact_quotes_text", ''::"text"))) WHERE ("exact_quotes_text" IS NOT NULL);



CREATE INDEX "idx_ai_insights_meeting_name" ON "public"."ai_insights" USING "btree" ("meeting_name");



CREATE INDEX "idx_ai_insights_project" ON "public"."ai_insights" USING "btree" ("project_id");



CREATE INDEX "idx_ai_insights_project_id" ON "public"."ai_insights" USING "btree" ("project_id");



CREATE INDEX "idx_ai_insights_project_name" ON "public"."ai_insights" USING "btree" ("project_name");



CREATE INDEX "idx_ai_insights_status" ON "public"."ai_insights" USING "btree" ("status");



CREATE INDEX "idx_ai_insights_type" ON "public"."ai_insights" USING "btree" ("insight_type");



CREATE INDEX "idx_ai_tasks_due_date" ON "public"."ai_tasks" USING "btree" ("status", "due_date");



CREATE INDEX "idx_ai_tasks_project_status" ON "public"."ai_tasks" USING "btree" ("project_id", "status");



CREATE INDEX "idx_app_users_email" ON "public"."app_users" USING "btree" ("email");



CREATE INDEX "idx_archon_code_examples_metadata" ON "public"."archon_code_examples" USING "gin" ("metadata");



CREATE INDEX "idx_archon_code_examples_source_id" ON "public"."archon_code_examples" USING "btree" ("source_id");



CREATE INDEX "idx_archon_crawled_pages_metadata" ON "public"."archon_crawled_pages" USING "gin" ("metadata");



CREATE INDEX "idx_archon_crawled_pages_source_id" ON "public"."archon_crawled_pages" USING "btree" ("source_id");



CREATE INDEX "idx_archon_document_versions_created_at" ON "public"."archon_document_versions" USING "btree" ("created_at");



CREATE INDEX "idx_archon_document_versions_field_name" ON "public"."archon_document_versions" USING "btree" ("field_name");



CREATE INDEX "idx_archon_document_versions_project_id" ON "public"."archon_document_versions" USING "btree" ("project_id");



CREATE INDEX "idx_archon_document_versions_task_id" ON "public"."archon_document_versions" USING "btree" ("task_id");



CREATE INDEX "idx_archon_document_versions_version_number" ON "public"."archon_document_versions" USING "btree" ("version_number");



CREATE INDEX "idx_archon_project_sources_project_id" ON "public"."archon_project_sources" USING "btree" ("project_id");



CREATE INDEX "idx_archon_project_sources_source_id" ON "public"."archon_project_sources" USING "btree" ("source_id");



CREATE INDEX "idx_archon_prompts_name" ON "public"."archon_prompts" USING "btree" ("prompt_name");



CREATE INDEX "idx_archon_settings_category" ON "public"."archon_settings" USING "btree" ("category");



CREATE INDEX "idx_archon_settings_key" ON "public"."archon_settings" USING "btree" ("key");



CREATE INDEX "idx_archon_sources_knowledge_type" ON "public"."archon_sources" USING "btree" ((("metadata" ->> 'knowledge_type'::"text")));



CREATE INDEX "idx_archon_sources_metadata" ON "public"."archon_sources" USING "gin" ("metadata");



CREATE INDEX "idx_archon_sources_title" ON "public"."archon_sources" USING "btree" ("title");



CREATE INDEX "idx_archon_tasks_archived" ON "public"."archon_tasks" USING "btree" ("archived");



CREATE INDEX "idx_archon_tasks_archived_at" ON "public"."archon_tasks" USING "btree" ("archived_at");



CREATE INDEX "idx_archon_tasks_assignee" ON "public"."archon_tasks" USING "btree" ("assignee");



CREATE INDEX "idx_archon_tasks_order" ON "public"."archon_tasks" USING "btree" ("task_order");



CREATE INDEX "idx_archon_tasks_project_id" ON "public"."archon_tasks" USING "btree" ("project_id");



CREATE INDEX "idx_archon_tasks_status" ON "public"."archon_tasks" USING "btree" ("status");



CREATE INDEX "idx_asrs_blocks_section" ON "public"."asrs_blocks" USING "btree" ("section_id", "ordinal");



CREATE INDEX "idx_asrs_lookup" ON "public"."asrs_decision_matrix" USING "btree" ("asrs_type", "container_type", "max_depth_ft", "max_spacing_ft");



CREATE INDEX "idx_asrs_sections_slug" ON "public"."asrs_sections" USING "btree" ("slug");



CREATE INDEX "idx_asrs_sections_sort" ON "public"."asrs_sections" USING "btree" ("sort_key");



CREATE INDEX "idx_attachments_project_id" ON "public"."attachments" USING "btree" ("project_id");



CREATE INDEX "idx_billing_periods_project" ON "public"."billing_periods" USING "btree" ("project_id");



CREATE INDEX "idx_briefings_date" ON "public"."project_briefings" USING "btree" ("generated_at" DESC);



CREATE INDEX "idx_briefings_project" ON "public"."project_briefings" USING "btree" ("project_id");



CREATE INDEX "idx_budget_codes_cost_code" ON "public"."budget_codes" USING "btree" ("cost_code_id");



CREATE INDEX "idx_budget_codes_cost_type" ON "public"."budget_codes" USING "btree" ("cost_type_id") WHERE ("cost_type_id" IS NOT NULL);



CREATE INDEX "idx_budget_codes_project" ON "public"."budget_codes" USING "btree" ("project_id");



CREATE INDEX "idx_budget_codes_subjob" ON "public"."budget_codes" USING "btree" ("sub_job_id") WHERE ("sub_job_id" IS NOT NULL);



CREATE UNIQUE INDEX "idx_budget_codes_unique" ON "public"."budget_codes" USING "btree" ("project_id", "cost_code_id", COALESCE(("sub_job_id")::"text", ''::"text"), COALESCE(("cost_type_id")::"text", ''::"text"));



CREATE INDEX "idx_budget_items_budget_code" ON "public"."budget_items" USING "btree" ("budget_code_id") WHERE ("budget_code_id" IS NOT NULL);



CREATE INDEX "idx_budget_line_items_budget_code" ON "public"."budget_line_items" USING "btree" ("budget_code_id");



CREATE INDEX "idx_budget_snapshots_baseline" ON "public"."budget_snapshots" USING "btree" ("is_baseline") WHERE ("is_baseline" = true);



CREATE INDEX "idx_budget_snapshots_created_at" ON "public"."budget_snapshots" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_budget_snapshots_project" ON "public"."budget_snapshots" USING "btree" ("project_id");



CREATE INDEX "idx_budget_snapshots_type" ON "public"."budget_snapshots" USING "btree" ("snapshot_type");



CREATE INDEX "idx_change_event_line_items_event" ON "public"."change_event_line_items" USING "btree" ("change_event_id");



CREATE INDEX "idx_change_events_project" ON "public"."change_events" USING "btree" ("project_id");



CREATE INDEX "idx_change_order_line_items_budget" ON "public"."change_order_line_items" USING "btree" ("budget_code_id") WHERE ("budget_code_id" IS NOT NULL);



CREATE INDEX "idx_change_order_line_items_co" ON "public"."change_order_line_items" USING "btree" ("change_order_id");



CREATE INDEX "idx_change_order_line_items_cost_code" ON "public"."change_order_line_items" USING "btree" ("cost_code_id") WHERE ("cost_code_id" IS NOT NULL);



CREATE INDEX "idx_change_orders_co_number" ON "public"."change_orders" USING "btree" ("co_number");



CREATE INDEX "idx_change_orders_project_id" ON "public"."change_orders" USING "btree" ("project_id");



CREATE INDEX "idx_chat_history_session_id" ON "public"."chat_history" USING "btree" ("session_id");



CREATE INDEX "idx_chat_history_user_id" ON "public"."chat_history" USING "btree" ("user_id");



CREATE INDEX "idx_chat_thread_items_thread_created" ON "public"."chat_thread_items" USING "btree" ("thread_id", "created_at" DESC);



CREATE INDEX "idx_chat_threads_created_at" ON "public"."chat_threads" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_chunks_chunk_index" ON "public"."chunks" USING "btree" ("document_id", "chunk_index");



CREATE INDEX "idx_chunks_content_trgm" ON "public"."chunks" USING "gin" ("content" "public"."gin_trgm_ops");



CREATE INDEX "idx_chunks_document_id" ON "public"."chunks" USING "btree" ("document_id");



CREATE INDEX "idx_chunks_document_id_title" ON "public"."chunks" USING "btree" ("document_id", "document_title");



CREATE INDEX "idx_chunks_embedding" ON "public"."chunks" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='1');



CREATE INDEX "idx_co_approvals_co_id" ON "public"."change_order_approvals" USING "btree" ("change_order_id");



CREATE INDEX "idx_co_costs_change_order_id" ON "public"."change_order_costs" USING "btree" ("change_order_id");



CREATE INDEX "idx_code_examples_metadata" ON "public"."code_examples" USING "gin" ("metadata");



CREATE INDEX "idx_code_examples_source_id" ON "public"."code_examples" USING "btree" ("source_id");



CREATE INDEX "idx_colines_change_order_id" ON "public"."change_order_lines" USING "btree" ("change_order_id");



CREATE INDEX "idx_components_screenshot" ON "public"."procore_components" USING "btree" ("screenshot_id");



CREATE INDEX "idx_components_type" ON "public"."procore_components" USING "btree" ("component_type");



CREATE INDEX "idx_contacts_company_id" ON "public"."contacts" USING "btree" ("company_id");



CREATE INDEX "idx_contracts_client_id" ON "public"."contracts" USING "btree" ("client_id");



CREATE INDEX "idx_contracts_erp_status" ON "public"."contracts" USING "btree" ("erp_status");



CREATE INDEX "idx_contracts_project_id" ON "public"."contracts" USING "btree" ("project_id");



CREATE INDEX "idx_contracts_status" ON "public"."contracts" USING "btree" ("status");



CREATE INDEX "idx_conversations_user" ON "public"."conversations" USING "btree" ("user_id");



CREATE INDEX "idx_crawled_pages_metadata" ON "public"."crawled_pages" USING "gin" ("metadata");



CREATE INDEX "idx_crawled_pages_source_id" ON "public"."crawled_pages" USING "btree" ("source_id");



CREATE INDEX "idx_daily_recaps_date" ON "public"."daily_recaps" USING "btree" ("recap_date" DESC);



CREATE INDEX "idx_direct_cost_line_items_approved" ON "public"."direct_cost_line_items" USING "btree" ("approved");



CREATE INDEX "idx_direct_cost_line_items_budget" ON "public"."direct_cost_line_items" USING "btree" ("budget_code_id") WHERE ("budget_code_id" IS NOT NULL);



CREATE INDEX "idx_direct_cost_line_items_cost_code" ON "public"."direct_cost_line_items" USING "btree" ("cost_code_id") WHERE ("cost_code_id" IS NOT NULL);



CREATE INDEX "idx_direct_cost_line_items_date" ON "public"."direct_cost_line_items" USING "btree" ("transaction_date");



CREATE INDEX "idx_direct_cost_line_items_project" ON "public"."direct_cost_line_items" USING "btree" ("project_id");



CREATE INDEX "idx_discrepancies_location" ON "public"."discrepancies" USING "gin" ("location_in_doc");



CREATE INDEX "idx_discrepancies_search" ON "public"."discrepancies" USING "gin" ("to_tsvector"('"english"'::"regconfig", ((("title")::"text" || ' '::"text") || "description")));



CREATE INDEX "idx_discrepancies_severity" ON "public"."discrepancies" USING "btree" ("severity");



CREATE INDEX "idx_discrepancies_status" ON "public"."discrepancies" USING "btree" ("status");



CREATE INDEX "idx_discrepancies_submittal_id" ON "public"."discrepancies" USING "btree" ("submittal_id");



CREATE INDEX "idx_discrepancies_type" ON "public"."discrepancies" USING "btree" ("discrepancy_type");



CREATE INDEX "idx_document_chunks_content_hash" ON "public"."document_chunks" USING "btree" ("content_hash");



CREATE INDEX "idx_document_chunks_created_at" ON "public"."document_chunks" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_document_chunks_document_id" ON "public"."document_chunks" USING "btree" ("document_id");



CREATE INDEX "idx_document_insights_created_at" ON "public"."document_insights" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_document_insights_doc_title" ON "public"."document_insights" USING "gin" ("to_tsvector"('"english"'::"regconfig", "doc_title"));



CREATE INDEX "idx_document_insights_document_date" ON "public"."document_insights" USING "btree" ("document_date");



CREATE INDEX "idx_document_insights_document_id" ON "public"."document_insights" USING "btree" ("document_id");



CREATE INDEX "idx_document_insights_project_id" ON "public"."document_insights" USING "btree" ("project_id");



CREATE INDEX "idx_document_insights_project_name" ON "public"."document_insights" USING "btree" ("project_name");



CREATE INDEX "idx_document_insights_type" ON "public"."document_insights" USING "btree" ("insight_type");



CREATE INDEX "idx_document_metadata_category" ON "public"."document_metadata" USING "btree" ("category");



CREATE INDEX "idx_document_metadata_composite" ON "public"."document_metadata" USING "btree" ("type", "category", "date" DESC);



CREATE INDEX "idx_document_metadata_content_fts" ON "public"."document_metadata" USING "gin" ("to_tsvector"('"english"'::"regconfig", "content"));



CREATE INDEX "idx_document_metadata_date" ON "public"."document_metadata" USING "btree" ("date");



CREATE INDEX "idx_document_metadata_fireflies_id" ON "public"."document_metadata" USING "btree" ("fireflies_id");



CREATE INDEX "idx_document_metadata_lower_title" ON "public"."document_metadata" USING "btree" ("lower"("title"));



CREATE INDEX "idx_document_metadata_participants" ON "public"."document_metadata" USING "gin" ("to_tsvector"('"english"'::"regconfig", "participants"));



CREATE INDEX "idx_document_metadata_project_captured" ON "public"."document_metadata" USING "btree" ("project_id", "captured_at");



CREATE INDEX "idx_document_metadata_type" ON "public"."document_metadata" USING "btree" ("type");



CREATE INDEX "idx_documents_created_at" ON "public"."documents" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_documents_metadata" ON "public"."documents" USING "gin" ("metadata");



CREATE INDEX "idx_documents_project_id" ON "public"."documents" USING "btree" ("project_id");



CREATE INDEX "idx_documents_status" ON "public"."fm_documents" USING "btree" ("processing_status");



CREATE INDEX "idx_documents_storage_object_id" ON "public"."documents" USING "btree" ("storage_object_id");



CREATE INDEX "idx_documents_type" ON "public"."fm_documents" USING "btree" ("document_type");



CREATE INDEX "idx_features_module" ON "public"."procore_features" USING "btree" ("module_id");



CREATE INDEX "idx_figures_asrs_type" ON "public"."fm_global_figures" USING "btree" ("asrs_type");



CREATE INDEX "idx_figures_container_type" ON "public"."fm_global_figures" USING "btree" ("container_type");



CREATE INDEX "idx_figures_embedding" ON "public"."fm_global_figures" USING "hnsw" ("embedding" "public"."vector_cosine_ops");



CREATE INDEX "idx_figures_keywords" ON "public"."fm_global_figures" USING "gin" ("search_keywords");



CREATE INDEX "idx_figures_number" ON "public"."fm_global_figures" USING "btree" ("figure_number");



CREATE INDEX "idx_figures_tables" ON "public"."fm_global_figures" USING "gin" ("related_tables");



CREATE INDEX "idx_figures_type" ON "public"."fm_global_figures" USING "btree" ("figure_type");



CREATE INDEX "idx_fm_blocks_search" ON "public"."fm_blocks" USING "gin" ("search_vector");



CREATE INDEX "idx_fm_blocks_section" ON "public"."fm_blocks" USING "btree" ("section_id", "ordinal");



CREATE INDEX "idx_fm_blocks_type" ON "public"."fm_blocks" USING "btree" ("block_type");



CREATE INDEX "idx_fm_documents_content_search" ON "public"."fm_documents" USING "gin" ("to_tsvector"('"english"'::"regconfig", "content"));



CREATE INDEX "idx_fm_global_figures_number" ON "public"."fm_global_figures" USING "btree" ("figure_number");



CREATE INDEX "idx_fm_global_tables_number" ON "public"."fm_global_tables" USING "btree" ("table_number");



CREATE INDEX "idx_fm_sections_parent" ON "public"."fm_sections" USING "btree" ("parent_id");



CREATE INDEX "idx_fm_sections_slug" ON "public"."fm_sections" USING "btree" ("slug");



CREATE INDEX "idx_fm_sections_sort" ON "public"."fm_sections" USING "btree" ("sort_key");



CREATE INDEX "idx_fm_tables_asrs_type" ON "public"."fm_global_tables" USING "btree" ("asrs_type");



CREATE INDEX "idx_fm_tables_commodities" ON "public"."fm_global_tables" USING "gin" ("commodity_types");



CREATE INDEX "idx_fm_tables_number" ON "public"."fm_global_tables" USING "btree" ("table_number");



CREATE INDEX "idx_fm_tables_status" ON "public"."fm_global_tables" USING "btree" ("extraction_status");



CREATE INDEX "idx_fm_tables_system_type" ON "public"."fm_global_tables" USING "btree" ("system_type");



CREATE INDEX "idx_fm_tables_title_search" ON "public"."fm_global_tables" USING "gin" ("to_tsvector"('"english"'::"regconfig", "title"));



CREATE INDEX "idx_fm_tables_type_system" ON "public"."fm_global_tables" USING "btree" ("asrs_type", "system_type");



CREATE INDEX "idx_fm_text_chunks_clause" ON "public"."fm_text_chunks" USING "btree" ("clause_id");



CREATE INDEX "idx_fm_text_chunks_embedding" ON "public"."fm_text_chunks" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='100');



CREATE INDEX "idx_fm_text_chunks_keywords" ON "public"."fm_text_chunks" USING "gin" ("search_keywords");



CREATE INDEX "idx_fm_text_chunks_page" ON "public"."fm_text_chunks" USING "btree" ("page_number");



CREATE INDEX "idx_fm_text_chunks_requirements" ON "public"."fm_text_chunks" USING "gin" ("extracted_requirements");



CREATE INDEX "idx_fm_text_chunks_topics" ON "public"."fm_text_chunks" USING "gin" ("topics");



CREATE INDEX "idx_form_submissions_created" ON "public"."fm_form_submissions" USING "btree" ("created_at");



CREATE INDEX "idx_form_submissions_lead_score" ON "public"."fm_form_submissions" USING "btree" ("lead_score");



CREATE INDEX "idx_form_submissions_status" ON "public"."fm_form_submissions" USING "btree" ("lead_status");



CREATE INDEX "idx_initiatives_category" ON "public"."initiatives" USING "btree" ("category");



CREATE INDEX "idx_initiatives_keywords" ON "public"."initiatives" USING "gin" ("keywords");



CREATE INDEX "idx_initiatives_owner" ON "public"."initiatives" USING "btree" ("owner");



CREATE INDEX "idx_initiatives_status" ON "public"."initiatives" USING "btree" ("status");



CREATE INDEX "idx_insights_assignee" ON "public"."document_insights" USING "btree" ("assignee");



CREATE INDEX "idx_insights_critical_path" ON "public"."document_insights" USING "btree" ("critical_path_impact");



CREATE INDEX "idx_insights_due_date" ON "public"."document_insights" USING "btree" ("due_date");



CREATE INDEX "idx_insights_resolved" ON "public"."document_insights" USING "btree" ("resolved");



CREATE INDEX "idx_insights_severity" ON "public"."document_insights" USING "btree" ("severity");



CREATE INDEX "idx_messages_computed_session" ON "public"."messages" USING "btree" ("computed_session_user_id");



CREATE INDEX "idx_messages_session" ON "public"."messages" USING "btree" ("session_id");



CREATE INDEX "idx_modules_category" ON "public"."procore_modules" USING "btree" ("category");



CREATE INDEX "idx_mv_budget_rollup_cost_code" ON "public"."mv_budget_rollup" USING "btree" ("cost_code_id");



CREATE INDEX "idx_mv_budget_rollup_cost_type" ON "public"."mv_budget_rollup" USING "btree" ("cost_type_id") WHERE ("cost_type_id" IS NOT NULL);



CREATE UNIQUE INDEX "idx_mv_budget_rollup_id" ON "public"."mv_budget_rollup" USING "btree" ("budget_code_id");



CREATE INDEX "idx_mv_budget_rollup_project" ON "public"."mv_budget_rollup" USING "btree" ("project_id");



CREATE INDEX "idx_mv_budget_rollup_subjob" ON "public"."mv_budget_rollup" USING "btree" ("sub_job_id") WHERE ("sub_job_id" IS NOT NULL);



CREATE INDEX "idx_notes_created_at" ON "public"."notes" USING "btree" ("created_at");



CREATE INDEX "idx_notes_project_id" ON "public"."notes" USING "btree" ("project_id");



CREATE INDEX "idx_owner_invoice_line_items_invoice" ON "public"."owner_invoice_line_items" USING "btree" ("invoice_id");



CREATE INDEX "idx_owner_invoices_contract" ON "public"."owner_invoices" USING "btree" ("contract_id");



CREATE INDEX "idx_payments_contract" ON "public"."payment_transactions" USING "btree" ("contract_id");



CREATE INDEX "idx_payments_invoice" ON "public"."payment_transactions" USING "btree" ("invoice_id");



CREATE INDEX "idx_pcco_line_items_pcco" ON "public"."pcco_line_items" USING "btree" ("pcco_id");



CREATE INDEX "idx_pccos_contract" ON "public"."prime_contract_change_orders" USING "btree" ("contract_id");



CREATE INDEX "idx_pco_line_items_pco" ON "public"."pco_line_items" USING "btree" ("pco_id");



CREATE INDEX "idx_pcos_change_event" ON "public"."prime_potential_change_orders" USING "btree" ("change_event_id");



CREATE INDEX "idx_pcos_contract" ON "public"."prime_potential_change_orders" USING "btree" ("contract_id");



CREATE INDEX "idx_pcos_project" ON "public"."prime_potential_change_orders" USING "btree" ("project_id");



CREATE INDEX "idx_prime_contract_sovs_contract" ON "public"."prime_contract_sovs" USING "btree" ("contract_id");



CREATE INDEX "idx_processing_queue_document_id" ON "public"."processing_queue" USING "btree" ("document_id");



CREATE INDEX "idx_processing_queue_status" ON "public"."processing_queue" USING "btree" ("status");



CREATE INDEX "idx_project_directory_company" ON "public"."project_directory" USING "btree" ("company_id");



CREATE INDEX "idx_project_directory_project" ON "public"."project_directory" USING "btree" ("project_id");



CREATE INDEX "idx_project_insights_project_captured" ON "public"."project_insights" USING "btree" ("project_id", "captured_at" DESC);



CREATE INDEX "idx_project_members_project" ON "public"."project_members" USING "btree" ("project_id");



CREATE INDEX "idx_project_members_project_user" ON "public"."project_members" USING "btree" ("project_id", "user_id");



CREATE INDEX "idx_project_members_user" ON "public"."project_members" USING "btree" ("user_id");



CREATE INDEX "idx_project_tasks_project" ON "public"."project_tasks" USING "btree" ("project_id");



CREATE INDEX "idx_project_tasks_status" ON "public"."project_tasks" USING "btree" ("status");



CREATE INDEX "idx_project_users_project_id" ON "public"."project_users" USING "btree" ("project_id");



CREATE INDEX "idx_project_users_user_id" ON "public"."project_users" USING "btree" ("user_id");



CREATE INDEX "idx_projects_archived" ON "public"."projects" USING "btree" ("archived");



CREATE INDEX "idx_projects_delivery_method" ON "public"."projects" USING "btree" ("delivery_method");



CREATE INDEX "idx_projects_health_score" ON "public"."projects" USING "btree" ("health_score" DESC);



CREATE INDEX "idx_projects_phase" ON "public"."projects" USING "btree" ("phase");



CREATE INDEX "idx_projects_project_manager" ON "public"."projects" USING "btree" ("project_manager");



CREATE UNIQUE INDEX "idx_projects_project_number" ON "public"."projects" USING "btree" ("project_number") WHERE ("project_number" IS NOT NULL);



CREATE INDEX "idx_projects_project_sector" ON "public"."projects" USING "btree" ("project_sector");



CREATE INDEX "idx_projects_state" ON "public"."projects" USING "btree" ("state");



CREATE INDEX "idx_projects_summary_updated" ON "public"."projects" USING "btree" ("summary_updated_at" DESC);



CREATE INDEX "idx_projects_work_scope" ON "public"."projects" USING "btree" ("work_scope");



CREATE INDEX "idx_prospects_assigned_to" ON "public"."prospects" USING "btree" ("assigned_to");



CREATE INDEX "idx_prospects_industry" ON "public"."prospects" USING "btree" ("industry");



CREATE INDEX "idx_prospects_next_follow_up" ON "public"."prospects" USING "btree" ("next_follow_up");



CREATE INDEX "idx_prospects_status" ON "public"."prospects" USING "btree" ("status");



CREATE INDEX "idx_qto_items_project_id" ON "public"."qto_items" USING "btree" ("project_id");



CREATE INDEX "idx_qto_items_qto_id" ON "public"."qto_items" USING "btree" ("qto_id");



CREATE INDEX "idx_qtos_project_id" ON "public"."qtos" USING "btree" ("project_id");



CREATE INDEX "idx_rag_pipeline_state_last_run" ON "public"."rag_pipeline_state" USING "btree" ("last_run");



CREATE INDEX "idx_rag_pipeline_state_pipeline_type" ON "public"."rag_pipeline_state" USING "btree" ("pipeline_type");



CREATE INDEX "idx_reviews_due_date" ON "public"."reviews" USING "btree" ("due_date");



CREATE INDEX "idx_reviews_reviewer_id" ON "public"."reviews" USING "btree" ("reviewer_id");



CREATE INDEX "idx_reviews_status" ON "public"."reviews" USING "btree" ("status");



CREATE INDEX "idx_reviews_submittal_id" ON "public"."reviews" USING "btree" ("submittal_id");



CREATE INDEX "idx_rfis_due_date" ON "public"."rfis" USING "btree" ("due_date");



CREATE INDEX "idx_rfis_number_project" ON "public"."rfis" USING "btree" ("project_id", "number");



CREATE INDEX "idx_rfis_project_id" ON "public"."rfis" USING "btree" ("project_id");



CREATE INDEX "idx_rfis_status" ON "public"."rfis" USING "btree" ("status");



CREATE INDEX "idx_schedule_of_values_commitment" ON "public"."schedule_of_values" USING "btree" ("commitment_id");



CREATE INDEX "idx_schedule_of_values_contract" ON "public"."schedule_of_values" USING "btree" ("contract_id");



CREATE INDEX "idx_schedule_of_values_status" ON "public"."schedule_of_values" USING "btree" ("status");



CREATE INDEX "idx_schedule_progress_task_id" ON "public"."schedule_progress_updates" USING "btree" ("task_id");



CREATE INDEX "idx_schedule_resources_task_id" ON "public"."schedule_resources" USING "btree" ("task_id");



CREATE INDEX "idx_schedule_tasks_project_id" ON "public"."schedule_tasks" USING "btree" ("project_id");



CREATE INDEX "idx_schedule_tasks_schedule_id" ON "public"."schedule_tasks" USING "btree" ("schedule_id");



CREATE INDEX "idx_screenshots_category" ON "public"."procore_screenshots" USING "btree" ("category");



CREATE INDEX "idx_screenshots_name" ON "public"."procore_screenshots" USING "btree" ("name");



CREATE INDEX "idx_screenshots_session" ON "public"."procore_screenshots" USING "btree" ("session_id");



CREATE INDEX "idx_sov_line_items_cost_code" ON "public"."sov_line_items" USING "btree" ("cost_code_id");



CREATE INDEX "idx_sov_line_items_sov" ON "public"."sov_line_items" USING "btree" ("sov_id");



CREATE INDEX "idx_specifications_content_search" ON "public"."specifications" USING "gin" ("to_tsvector"('"english"'::"regconfig", "content"));



CREATE INDEX "idx_specifications_project_id" ON "public"."specifications" USING "btree" ("project_id");



CREATE INDEX "idx_specifications_requirements" ON "public"."specifications" USING "gin" ("requirements");



CREATE INDEX "idx_specifications_section" ON "public"."specifications" USING "btree" ("section_number");



CREATE INDEX "idx_sprinkler_configs_height" ON "public"."fm_sprinkler_configs" USING "btree" ("ceiling_height_ft");



CREATE INDEX "idx_sprinkler_configs_kfactor" ON "public"."fm_sprinkler_configs" USING "btree" ("k_factor");



CREATE INDEX "idx_sprinkler_configs_lookup" ON "public"."fm_sprinkler_configs" USING "btree" ("table_id", "ceiling_height_ft", "k_factor");



CREATE INDEX "idx_sprinkler_configs_table" ON "public"."fm_sprinkler_configs" USING "btree" ("table_id");



CREATE INDEX "idx_sub_jobs_active" ON "public"."sub_jobs" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_sub_jobs_project" ON "public"."sub_jobs" USING "btree" ("project_id");



CREATE INDEX "idx_subcontractor_contacts_subcontractor_id" ON "public"."subcontractor_contacts" USING "btree" ("subcontractor_id");



CREATE INDEX "idx_subcontractor_documents_expiration" ON "public"."subcontractor_documents" USING "btree" ("expiration_date");



CREATE INDEX "idx_subcontractor_documents_subcontractor_id" ON "public"."subcontractor_documents" USING "btree" ("subcontractor_id");



CREATE INDEX "idx_subcontractor_documents_type" ON "public"."subcontractor_documents" USING "btree" ("document_type");



CREATE INDEX "idx_subcontractor_projects_subcontractor_id" ON "public"."subcontractor_projects" USING "btree" ("subcontractor_id");



CREATE INDEX "idx_subcontractors_asrs_experience" ON "public"."subcontractors" USING "btree" ("asrs_experience_years");



CREATE INDEX "idx_subcontractors_company_name" ON "public"."subcontractors" USING "btree" ("company_name");



CREATE INDEX "idx_subcontractors_fm_certified" ON "public"."subcontractors" USING "btree" ("fm_global_certified");



CREATE INDEX "idx_subcontractors_service_areas" ON "public"."subcontractors" USING "gin" ("service_areas");



CREATE INDEX "idx_subcontractors_specialties" ON "public"."subcontractors" USING "gin" ("specialties");



CREATE INDEX "idx_subcontractors_status" ON "public"."subcontractors" USING "btree" ("status");



CREATE INDEX "idx_subcontractors_tier_level" ON "public"."subcontractors" USING "btree" ("tier_level");



CREATE INDEX "idx_submittal_documents_submittal_id" ON "public"."submittal_documents" USING "btree" ("submittal_id");



CREATE INDEX "idx_submittal_documents_text_search" ON "public"."submittal_documents" USING "gin" ("to_tsvector"('"english"'::"regconfig", "extracted_text"));



CREATE INDEX "idx_submittal_history_submittal_id" ON "public"."submittal_history" USING "btree" ("submittal_id");



CREATE INDEX "idx_submittal_notifications_unread" ON "public"."submittal_notifications" USING "btree" ("user_id", "is_read");



CREATE INDEX "idx_submittal_notifications_user_id" ON "public"."submittal_notifications" USING "btree" ("user_id");



CREATE INDEX "idx_submittals_metadata" ON "public"."submittals" USING "gin" ("metadata");



CREATE INDEX "idx_submittals_number" ON "public"."submittals" USING "btree" ("submittal_number");



CREATE INDEX "idx_submittals_project_id" ON "public"."submittals" USING "btree" ("project_id");



CREATE INDEX "idx_submittals_status" ON "public"."submittals" USING "btree" ("status");



CREATE INDEX "idx_submittals_submission_date" ON "public"."submittals" USING "btree" ("submission_date");



CREATE INDEX "idx_table_project_id" ON "public"."document_metadata" USING "btree" ("project_id");



CREATE INDEX "idx_task_deps_task_id" ON "public"."schedule_task_dependencies" USING "btree" ("task_id");



CREATE INDEX "idx_vertical_markup_project" ON "public"."vertical_markup" USING "btree" ("project_id");



CREATE INDEX "meeting_segments_project_ids_gin_idx" ON "public"."meeting_segments" USING "gin" ("project_ids");



CREATE INDEX "meeting_segments_summary_embedding_idx" ON "public"."meeting_segments" USING "hnsw" ("summary_embedding" "public"."vector_cosine_ops") WITH ("m"='16', "ef_construction"='64');



CREATE INDEX "opportunities_client_idx" ON "public"."opportunities" USING "btree" ("client_id");



CREATE INDEX "opportunities_embedding_idx" ON "public"."opportunities" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='50');



CREATE INDEX "opportunities_metadata_idx" ON "public"."opportunities" USING "btree" ("metadata_id");



CREATE INDEX "opportunities_project_ids_gin_idx" ON "public"."opportunities" USING "gin" ("project_ids");



CREATE INDEX "opportunities_project_idx" ON "public"."opportunities" USING "btree" ("project_id");



CREATE INDEX "opportunities_status_idx" ON "public"."opportunities" USING "btree" ("status");



CREATE INDEX "opportunities_type_idx" ON "public"."opportunities" USING "btree" ("type");



CREATE INDEX "parts_message_id_idx" ON "public"."parts" USING "btree" ("messageId");



CREATE INDEX "parts_message_id_order_idx" ON "public"."parts" USING "btree" ("messageId", "order");



CREATE INDEX "project_cost_codes_code_idx" ON "public"."project_cost_codes" USING "btree" ("cost_code_id");



CREATE INDEX "project_cost_codes_project_idx" ON "public"."project_cost_codes" USING "btree" ("project_id");



CREATE INDEX "projects_created_idx" ON "public"."user_projects" USING "btree" ("created_at" DESC);



CREATE INDEX "recommendations_priority_idx" ON "public"."design_recommendations" USING "btree" ("priority_level");



CREATE INDEX "risks_embedding_idx" ON "public"."risks" USING "hnsw" ("embedding" "public"."vector_cosine_ops") WITH ("m"='16', "ef_construction"='64');



CREATE INDEX "risks_project_ids_gin_idx" ON "public"."risks" USING "gin" ("project_ids");



CREATE INDEX "tasks_project_ids_gin_idx" ON "public"."tasks" USING "gin" ("project_ids");



CREATE INDEX "user_projects_lead_score_idx" ON "public"."user_projects" USING "btree" ("lead_score" DESC);



CREATE INDEX "user_projects_status_idx" ON "public"."user_projects" USING "btree" ("status");



CREATE UNIQUE INDEX "ux_document_metadata_content_hash" ON "public"."document_metadata" USING "btree" ("content_hash");



CREATE UNIQUE INDEX "ux_document_metadata_fireflies" ON "public"."document_metadata" USING "btree" ("fireflies_id") WHERE ("fireflies_id" IS NOT NULL);



CREATE UNIQUE INDEX "ux_ingestion_jobs_fireflies" ON "public"."ingestion_jobs" USING "btree" ("fireflies_id") WHERE ("fireflies_id" IS NOT NULL);



CREATE INDEX "ix_vector_cosine_ops_hnsw_m16_efc64_616c875" ON "vecs"."mem0_memories" USING "hnsw" ("vec" "public"."vector_cosine_ops") WITH ("m"='16', "ef_construction"='64');



CREATE OR REPLACE VIEW "public"."active_submittals" AS
 SELECT "s"."id",
    "s"."project_id",
    "s"."specification_id",
    "s"."submittal_type_id",
    "s"."submittal_number",
    "s"."title",
    "s"."description",
    "s"."submitted_by",
    "s"."submitter_company",
    "s"."submission_date",
    "s"."required_approval_date",
    "s"."priority",
    "s"."status",
    "s"."current_version",
    "s"."total_versions",
    "s"."metadata",
    "s"."created_at",
    "s"."updated_at",
    "p"."name" AS "project_name",
    "u"."email" AS "submitted_by_email",
    "st"."name" AS "submittal_type_name",
    "count"("d"."id") AS "discrepancy_count",
    "count"(
        CASE
            WHEN (("d"."severity")::"text" = 'critical'::"text") THEN 1
            ELSE NULL::integer
        END) AS "critical_discrepancies"
   FROM (((("public"."submittals" "s"
     JOIN "public"."projects" "p" ON (("s"."project_id" = "p"."id")))
     JOIN "public"."users" "u" ON (("s"."submitted_by" = "u"."id")))
     JOIN "public"."submittal_types" "st" ON (("s"."submittal_type_id" = "st"."id")))
     LEFT JOIN "public"."discrepancies" "d" ON ((("s"."id" = "d"."submittal_id") AND (("d"."status")::"text" = 'open'::"text"))))
  WHERE (("s"."status")::"text" <> ALL ((ARRAY['approved'::character varying, 'rejected'::character varying, 'superseded'::character varying])::"text"[]))
  GROUP BY "s"."id", "p"."name", "u"."email", "st"."name";



CREATE OR REPLACE TRIGGER "Employees synced to Notion" AFTER INSERT OR DELETE OR UPDATE ON "public"."employees" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://hooks.zapier.com/hooks/catch/14978225/ubl8syy/', 'POST', '{"Content-type":"application/json"}', '{}', '5000');



CREATE OR REPLACE TRIGGER "_ai_insights_counts_del" AFTER DELETE ON "public"."ai_insights" FOR EACH ROW EXECUTE FUNCTION "public"."_ai_insights_counts_trigger_fn"();



CREATE OR REPLACE TRIGGER "_ai_insights_counts_ins" AFTER INSERT ON "public"."ai_insights" FOR EACH ROW EXECUTE FUNCTION "public"."_ai_insights_counts_trigger_fn"();



CREATE OR REPLACE TRIGGER "_ai_insights_counts_upd" AFTER UPDATE ON "public"."ai_insights" FOR EACH ROW EXECUTE FUNCTION "public"."_ai_insights_counts_trigger_fn"();



CREATE OR REPLACE TRIGGER "budget_items_updated_at" BEFORE UPDATE ON "public"."budget_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "contacts_company_name_sync_trigger" BEFORE INSERT OR UPDATE ON "public"."contacts" FOR EACH ROW EXECUTE FUNCTION "public"."sync_contacts_company_name"();



CREATE OR REPLACE TRIGGER "document_metadata_set_category_trigger" BEFORE INSERT OR UPDATE ON "public"."document_metadata" FOR EACH ROW EXECUTE FUNCTION "public"."document_metadata_set_category"();



CREATE OR REPLACE TRIGGER "fm_blocks_search_vector_trigger" BEFORE INSERT OR UPDATE ON "public"."fm_blocks" FOR EACH ROW EXECUTE FUNCTION "public"."update_search_vector"();



CREATE OR REPLACE TRIGGER "generate-insights" AFTER INSERT OR UPDATE ON "public"."chunks" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://lgveqfnpkxvzbnnwuled.supabase.co/functions/v1/generate-insights', 'POST', '{"Content-type":"application/json"}', '{}', '5000');



CREATE OR REPLACE TRIGGER "populate_insight_names_trigger" BEFORE INSERT ON "public"."ai_insights" FOR EACH ROW EXECUTE FUNCTION "public"."populate_insight_names"();



CREATE OR REPLACE TRIGGER "refresh_on_owner_invoice_line_items" AFTER INSERT OR DELETE OR UPDATE ON "public"."owner_invoice_line_items" FOR EACH STATEMENT EXECUTE FUNCTION "public"."refresh_contract_financial_summary_trigger"();



CREATE OR REPLACE TRIGGER "refresh_on_payment_transactions" AFTER INSERT OR DELETE OR UPDATE ON "public"."payment_transactions" FOR EACH STATEMENT EXECUTE FUNCTION "public"."refresh_contract_financial_summary_trigger"();



CREATE OR REPLACE TRIGGER "refresh_on_pcco_line_items" AFTER INSERT OR DELETE OR UPDATE ON "public"."pcco_line_items" FOR EACH STATEMENT EXECUTE FUNCTION "public"."refresh_contract_financial_summary_trigger"();



CREATE OR REPLACE TRIGGER "refresh_on_pco_line_items" AFTER INSERT OR DELETE OR UPDATE ON "public"."pco_line_items" FOR EACH STATEMENT EXECUTE FUNCTION "public"."refresh_contract_financial_summary_trigger"();



CREATE OR REPLACE TRIGGER "set_fireflies_ingestion_jobs_timestamp" BEFORE UPDATE ON "public"."fireflies_ingestion_jobs" FOR EACH ROW EXECUTE FUNCTION "public"."set_timestamp"();



CREATE OR REPLACE TRIGGER "set_insight_severity" BEFORE INSERT ON "public"."document_insights" FOR EACH ROW EXECUTE FUNCTION "public"."set_default_severity"();



CREATE OR REPLACE TRIGGER "set_opportunities_timestamp" BEFORE UPDATE ON "public"."opportunities" FOR EACH ROW EXECUTE FUNCTION "public"."set_timestamp"();



CREATE OR REPLACE TRIGGER "set_project_id_by_title_trigger" BEFORE INSERT OR UPDATE ON "public"."documents" FOR EACH ROW EXECUTE FUNCTION "public"."set_project_id_by_title"();



CREATE OR REPLACE TRIGGER "set_project_id_from_title_trg" BEFORE INSERT OR UPDATE ON "public"."document_metadata" FOR EACH ROW EXECUTE FUNCTION "public"."set_project_id_from_title"();



CREATE OR REPLACE TRIGGER "track_submittal_status_changes" AFTER UPDATE ON "public"."submittals" FOR EACH ROW EXECUTE FUNCTION "public"."track_submittal_changes"();



CREATE OR REPLACE TRIGGER "trg_ai_insights_exact_quotes" BEFORE INSERT OR UPDATE ON "public"."ai_insights" FOR EACH ROW EXECUTE FUNCTION "public"."ai_insights_exact_quotes_trigger"();



CREATE OR REPLACE TRIGGER "trg_ai_tasks_updated" BEFORE UPDATE ON "public"."ai_tasks" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trg_cost_code_divisions_propagate_title" AFTER UPDATE ON "public"."cost_code_divisions" FOR EACH ROW EXECUTE FUNCTION "public"."fn_propagate_division_title_change"();



CREATE OR REPLACE TRIGGER "trg_enqueue_for_insights" AFTER UPDATE ON "public"."documents" FOR EACH ROW WHEN (((("new"."processing_status")::"text" = 'generate_insights'::"text") AND (("old"."processing_status")::"text" IS DISTINCT FROM ("new"."processing_status")::"text"))) EXECUTE FUNCTION "private"."enqueue_document_for_insights"();



CREATE OR REPLACE TRIGGER "trg_projects_audit" AFTER INSERT OR DELETE OR UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."fn_log_projects_change"();



CREATE OR REPLACE TRIGGER "trg_set_supervisor_name" BEFORE INSERT OR UPDATE OF "supervisor" ON "public"."employees" FOR EACH ROW EXECUTE FUNCTION "public"."set_supervisor_name"();



CREATE OR REPLACE TRIGGER "trg_sync_ai_insights_meeting_name" BEFORE INSERT OR UPDATE OF "meeting_id" ON "public"."ai_insights" FOR EACH ROW EXECUTE FUNCTION "public"."sync_ai_insights_meeting_name"();



CREATE OR REPLACE TRIGGER "trg_sync_client" BEFORE INSERT OR UPDATE OF "client_id" ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."sync_client"();



CREATE OR REPLACE TRIGGER "trg_sync_doc_meta_on_project_update" AFTER UPDATE OF "name" ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."sync_document_metadata_on_project_name_change"();



CREATE OR REPLACE TRIGGER "trg_sync_document_project_name" BEFORE INSERT OR UPDATE OF "project_id" ON "public"."document_metadata" FOR EACH ROW EXECUTE FUNCTION "public"."sync_document_project_name"();



CREATE OR REPLACE TRIGGER "trg_sync_insight_project_on_insert_update" BEFORE INSERT OR UPDATE OF "document_id" ON "public"."document_insights" FOR EACH ROW EXECUTE FUNCTION "public"."sync_insight_project_from_document"();



CREATE OR REPLACE TRIGGER "trg_sync_project" BEFORE INSERT OR UPDATE OF "project_id" ON "public"."documents" FOR EACH ROW EXECUTE FUNCTION "public"."sync_project"();



CREATE OR REPLACE TRIGGER "trg_sync_project_on_document_insights" BEFORE INSERT OR UPDATE OF "project_id" ON "public"."document_insights" FOR EACH ROW EXECUTE FUNCTION "public"."sync_document_insights_project"();



CREATE OR REPLACE TRIGGER "trigger_app_users_updated_at" BEFORE UPDATE ON "public"."app_users" FOR EACH ROW EXECUTE FUNCTION "public"."update_app_users_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_update_app_users_updated_at" BEFORE UPDATE ON "public"."app_users" FOR EACH ROW EXECUTE FUNCTION "public"."update_app_users_updated_at"();



CREATE OR REPLACE TRIGGER "update_archon_projects_updated_at" BEFORE UPDATE ON "public"."archon_projects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_archon_prompts_updated_at" BEFORE UPDATE ON "public"."archon_prompts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_archon_settings_updated_at" BEFORE UPDATE ON "public"."archon_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_archon_tasks_updated_at" BEFORE UPDATE ON "public"."archon_tasks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_billing_periods_updated_at" BEFORE UPDATE ON "public"."billing_periods" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_budget_codes_updated_at" BEFORE UPDATE ON "public"."budget_codes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_budget_line_items_updated_at" BEFORE UPDATE ON "public"."budget_line_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_change_order_line_items_updated_at" BEFORE UPDATE ON "public"."change_order_line_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_direct_cost_line_items_updated_at" BEFORE UPDATE ON "public"."direct_cost_line_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_discrepancies_updated_at" BEFORE UPDATE ON "public"."discrepancies" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_documents_updated_at" BEFORE UPDATE ON "public"."documents" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fm_documents_updated_at" BEFORE UPDATE ON "public"."fm_documents" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fm_form_submissions_updated_at" BEFORE UPDATE ON "public"."fm_form_submissions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fm_global_tables_updated_at" BEFORE UPDATE ON "public"."fm_global_tables" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fm_text_chunks_updated_at" BEFORE UPDATE ON "public"."fm_text_chunks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_initiatives_updated_at_trigger" BEFORE UPDATE ON "public"."initiatives" FOR EACH ROW EXECUTE FUNCTION "public"."update_initiatives_updated_at"();



CREATE OR REPLACE TRIGGER "update_insight_names_trigger" BEFORE UPDATE ON "public"."ai_insights" FOR EACH ROW EXECUTE FUNCTION "public"."update_insight_names"();



CREATE OR REPLACE TRIGGER "update_processing_queue_updated_at" BEFORE UPDATE ON "public"."processing_queue" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_procore_modules_updated_at" BEFORE UPDATE ON "public"."procore_modules" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_procore_screenshots_updated_at" BEFORE UPDATE ON "public"."procore_screenshots" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_rag_pipeline_state_updated_at" BEFORE UPDATE ON "public"."rag_pipeline_state" FOR EACH ROW EXECUTE FUNCTION "public"."update_rag_pipeline_state_updated_at"();



CREATE OR REPLACE TRIGGER "update_schedule_of_values_updated_at" BEFORE UPDATE ON "public"."schedule_of_values" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_sov_line_items_updated_at" BEFORE UPDATE ON "public"."sov_line_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_specifications_updated_at" BEFORE UPDATE ON "public"."specifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_sub_jobs_updated_at" BEFORE UPDATE ON "public"."sub_jobs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_subcontractors_updated_at" BEFORE UPDATE ON "public"."subcontractors" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_submittals_updated_at" BEFORE UPDATE ON "public"."submittals" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_vertical_markup_updated_at" BEFORE UPDATE ON "public"."vertical_markup" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "next_auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "next_auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "private"."document_processing_queue"
    ADD CONSTRAINT "document_processing_queue_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Prospects"
    ADD CONSTRAINT "Prospects_contact_fkey" FOREIGN KEY ("contact") REFERENCES "public"."contacts"("id") ON UPDATE CASCADE ON DELETE SET DEFAULT;



ALTER TABLE ONLY "public"."ai_analysis_jobs"
    ADD CONSTRAINT "ai_analysis_jobs_submittal_id_fkey" FOREIGN KEY ("submittal_id") REFERENCES "public"."submittals"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_insights"
    ADD CONSTRAINT "ai_insights_chunks_id_fkey" FOREIGN KEY ("chunks_id") REFERENCES "public"."chunks"("id");



ALTER TABLE ONLY "public"."ai_tasks"
    ADD CONSTRAINT "ai_tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ai_tasks"
    ADD CONSTRAINT "ai_tasks_source_document_id_fkey" FOREIGN KEY ("source_document_id") REFERENCES "public"."document_metadata"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."archon_code_examples"
    ADD CONSTRAINT "archon_code_examples_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."archon_sources"("source_id");



ALTER TABLE ONLY "public"."archon_crawled_pages"
    ADD CONSTRAINT "archon_crawled_pages_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."archon_sources"("source_id");



ALTER TABLE ONLY "public"."archon_document_versions"
    ADD CONSTRAINT "archon_document_versions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."archon_projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."archon_document_versions"
    ADD CONSTRAINT "archon_document_versions_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."archon_tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."archon_project_sources"
    ADD CONSTRAINT "archon_project_sources_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."archon_projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."archon_tasks"
    ADD CONSTRAINT "archon_tasks_parent_task_id_fkey" FOREIGN KEY ("parent_task_id") REFERENCES "public"."archon_tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."archon_tasks"
    ADD CONSTRAINT "archon_tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."archon_projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."asrs_blocks"
    ADD CONSTRAINT "asrs_blocks_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."asrs_sections"("id");



ALTER TABLE ONLY "public"."asrs_logic_cards"
    ADD CONSTRAINT "asrs_logic_cards_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."asrs_sections"("id") ON UPDATE CASCADE ON DELETE SET DEFAULT;



ALTER TABLE ONLY "public"."asrs_protection_rules"
    ADD CONSTRAINT "asrs_protection_rules_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."asrs_sections"("id");



ALTER TABLE ONLY "public"."asrs_sections"
    ADD CONSTRAINT "asrs_sections_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."asrs_sections"("id");



ALTER TABLE ONLY "public"."attachments"
    ADD CONSTRAINT "attachments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."billing_periods"
    ADD CONSTRAINT "billing_periods_closed_by_fkey" FOREIGN KEY ("closed_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."billing_periods"
    ADD CONSTRAINT "billing_periods_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."block_embeddings"
    ADD CONSTRAINT "block_embeddings_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "public"."asrs_blocks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."briefing_runs"
    ADD CONSTRAINT "briefing_runs_briefing_id_fkey" FOREIGN KEY ("briefing_id") REFERENCES "public"."project_briefings"("id");



ALTER TABLE ONLY "public"."budget_codes"
    ADD CONSTRAINT "budget_codes_cost_code_id_fkey" FOREIGN KEY ("cost_code_id") REFERENCES "public"."cost_codes"("id");



ALTER TABLE ONLY "public"."budget_codes"
    ADD CONSTRAINT "budget_codes_cost_type_id_fkey" FOREIGN KEY ("cost_type_id") REFERENCES "public"."cost_code_types"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."budget_codes"
    ADD CONSTRAINT "budget_codes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."budget_codes"
    ADD CONSTRAINT "budget_codes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."budget_codes"
    ADD CONSTRAINT "budget_codes_sub_job_id_fkey" FOREIGN KEY ("sub_job_id") REFERENCES "public"."sub_jobs"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."budget_items"
    ADD CONSTRAINT "budget_items_budget_code_id_fkey" FOREIGN KEY ("budget_code_id") REFERENCES "public"."budget_codes"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."budget_items"
    ADD CONSTRAINT "budget_items_cost_code_id_fkey" FOREIGN KEY ("cost_code_id") REFERENCES "public"."cost_codes"("id");



ALTER TABLE ONLY "public"."budget_items"
    ADD CONSTRAINT "budget_items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."app_users"("id");



ALTER TABLE ONLY "public"."budget_items"
    ADD CONSTRAINT "budget_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."budget_items"
    ADD CONSTRAINT "budget_items_sub_job_id_fkey" FOREIGN KEY ("sub_job_id") REFERENCES "public"."sub_jobs"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."budget_line_items"
    ADD CONSTRAINT "budget_line_items_budget_code_id_fkey" FOREIGN KEY ("budget_code_id") REFERENCES "public"."budget_codes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."budget_line_items"
    ADD CONSTRAINT "budget_line_items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."budget_modifications"
    ADD CONSTRAINT "budget_modifications_budget_item_id_fkey" FOREIGN KEY ("budget_item_id") REFERENCES "public"."budget_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."budget_snapshots"
    ADD CONSTRAINT "budget_snapshots_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."budget_snapshots"
    ADD CONSTRAINT "budget_snapshots_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."change_event_line_items"
    ADD CONSTRAINT "change_event_line_items_change_event_id_fkey" FOREIGN KEY ("change_event_id") REFERENCES "public"."change_events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."change_events"
    ADD CONSTRAINT "change_events_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."change_order_approvals"
    ADD CONSTRAINT "change_order_approvals_change_order_id_fkey" FOREIGN KEY ("change_order_id") REFERENCES "public"."change_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."change_order_costs"
    ADD CONSTRAINT "change_order_costs_change_order_id_fkey" FOREIGN KEY ("change_order_id") REFERENCES "public"."change_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."change_order_line_items"
    ADD CONSTRAINT "change_order_line_items_budget_code_id_fkey" FOREIGN KEY ("budget_code_id") REFERENCES "public"."budget_codes"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."change_order_line_items"
    ADD CONSTRAINT "change_order_line_items_change_order_id_fkey" FOREIGN KEY ("change_order_id") REFERENCES "public"."change_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."change_order_line_items"
    ADD CONSTRAINT "change_order_line_items_cost_code_id_fkey" FOREIGN KEY ("cost_code_id") REFERENCES "public"."cost_codes"("id");



ALTER TABLE ONLY "public"."change_order_lines"
    ADD CONSTRAINT "change_order_lines_change_order_id_fkey" FOREIGN KEY ("change_order_id") REFERENCES "public"."change_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."change_order_lines"
    ADD CONSTRAINT "change_order_lines_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."change_order_lines"
    ADD CONSTRAINT "change_order_lines_related_qto_item_id_fkey" FOREIGN KEY ("related_qto_item_id") REFERENCES "public"."qto_items"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."change_orders"
    ADD CONSTRAINT "change_orders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_history"
    ADD CONSTRAINT "chat_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_sessions"
    ADD CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_thread_attachment_files"
    ADD CONSTRAINT "chat_thread_attachment_files_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "public"."chat_thread_attachments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_thread_attachments"
    ADD CONSTRAINT "chat_thread_attachments_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."chat_threads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_thread_feedback"
    ADD CONSTRAINT "chat_thread_feedback_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."chat_threads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_thread_items"
    ADD CONSTRAINT "chat_thread_items_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."chat_threads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chunks"
    ADD CONSTRAINT "chunks_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."code_examples"
    ADD CONSTRAINT "code_examples_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("source_id");



ALTER TABLE ONLY "public"."commitment_changes"
    ADD CONSTRAINT "commitment_changes_commitment_id_fkey" FOREIGN KEY ("commitment_id") REFERENCES "public"."commitments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."commitments"
    ADD CONSTRAINT "commitments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cost_codes"
    ADD CONSTRAINT "cost_codes_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "public"."cost_code_divisions"("id");



ALTER TABLE ONLY "public"."cost_forecasts"
    ADD CONSTRAINT "cost_forecasts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."crawled_pages"
    ADD CONSTRAINT "crawled_pages_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("source_id");



ALTER TABLE ONLY "public"."daily_log_equipment"
    ADD CONSTRAINT "daily_log_equipment_daily_log_id_fkey" FOREIGN KEY ("daily_log_id") REFERENCES "public"."daily_logs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."daily_log_manpower"
    ADD CONSTRAINT "daily_log_manpower_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."daily_log_manpower"
    ADD CONSTRAINT "daily_log_manpower_daily_log_id_fkey" FOREIGN KEY ("daily_log_id") REFERENCES "public"."daily_logs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."daily_log_notes"
    ADD CONSTRAINT "daily_log_notes_daily_log_id_fkey" FOREIGN KEY ("daily_log_id") REFERENCES "public"."daily_logs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."daily_logs"
    ADD CONSTRAINT "daily_logs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."daily_logs"
    ADD CONSTRAINT "daily_logs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."decisions"
    ADD CONSTRAINT "decisions_metadata_id_fkey" FOREIGN KEY ("metadata_id") REFERENCES "public"."document_metadata"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."decisions"
    ADD CONSTRAINT "decisions_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "public"."meeting_segments"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."decisions"
    ADD CONSTRAINT "decisions_source_chunk_id_fkey" FOREIGN KEY ("source_chunk_id") REFERENCES "public"."documents"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."direct_cost_line_items"
    ADD CONSTRAINT "direct_cost_line_items_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."direct_cost_line_items"
    ADD CONSTRAINT "direct_cost_line_items_budget_code_id_fkey" FOREIGN KEY ("budget_code_id") REFERENCES "public"."budget_codes"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."direct_cost_line_items"
    ADD CONSTRAINT "direct_cost_line_items_cost_code_id_fkey" FOREIGN KEY ("cost_code_id") REFERENCES "public"."cost_codes"("id");



ALTER TABLE ONLY "public"."direct_cost_line_items"
    ADD CONSTRAINT "direct_cost_line_items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."direct_cost_line_items"
    ADD CONSTRAINT "direct_cost_line_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."direct_costs"
    ADD CONSTRAINT "direct_costs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."discrepancies"
    ADD CONSTRAINT "discrepancies_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."submittal_documents"("id");



ALTER TABLE ONLY "public"."discrepancies"
    ADD CONSTRAINT "discrepancies_specification_id_fkey" FOREIGN KEY ("specification_id") REFERENCES "public"."specifications"("id");



ALTER TABLE ONLY "public"."discrepancies"
    ADD CONSTRAINT "discrepancies_submittal_id_fkey" FOREIGN KEY ("submittal_id") REFERENCES "public"."submittals"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."document_group_access"
    ADD CONSTRAINT "document_group_access_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."document_metadata"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."document_group_access"
    ADD CONSTRAINT "document_group_access_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id");



ALTER TABLE ONLY "public"."document_insights"
    ADD CONSTRAINT "document_insights_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."document_metadata"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."document_metadata"
    ADD CONSTRAINT "document_metadata_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."document_rows"
    ADD CONSTRAINT "document_rows_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "public"."document_metadata"("id");



ALTER TABLE ONLY "public"."document_user_access"
    ADD CONSTRAINT "document_user_access_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."document_metadata"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."document_user_access"
    ADD CONSTRAINT "document_user_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."document_metadata"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON UPDATE CASCADE ON DELETE SET DEFAULT;



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_supervisor_fkey" FOREIGN KEY ("supervisor") REFERENCES "public"."employees"("id") ON UPDATE CASCADE ON DELETE SET DEFAULT;



ALTER TABLE ONLY "public"."erp_sync_log"
    ADD CONSTRAINT "erp_sync_log_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."financial_contracts"
    ADD CONSTRAINT "financial_contracts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."financial_contracts"
    ADD CONSTRAINT "financial_contracts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."financial_contracts"
    ADD CONSTRAINT "financial_contracts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."financial_contracts"
    ADD CONSTRAINT "financial_contracts_subcontractor_id_fkey" FOREIGN KEY ("subcontractor_id") REFERENCES "public"."subcontractors"("id");



ALTER TABLE ONLY "public"."fireflies_ingestion_jobs"
    ADD CONSTRAINT "fireflies_ingestion_jobs_metadata_id_fkey" FOREIGN KEY ("metadata_id") REFERENCES "public"."document_metadata"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."design_recommendations"
    ADD CONSTRAINT "fk_project_id" FOREIGN KEY ("project_id") REFERENCES "public"."user_projects"("id");



ALTER TABLE ONLY "public"."fm_blocks"
    ADD CONSTRAINT "fm_blocks_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."fm_sections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fm_global_tables"
    ADD CONSTRAINT "fm_global_tables_figures_fkey" FOREIGN KEY ("figures") REFERENCES "public"."fm_global_figures"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."fm_optimization_suggestions"
    ADD CONSTRAINT "fm_optimization_suggestions_form_submission_id_fkey" FOREIGN KEY ("form_submission_id") REFERENCES "public"."fm_form_submissions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fm_sections"
    ADD CONSTRAINT "fm_sections_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."fm_sections"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."fm_sprinkler_configs"
    ADD CONSTRAINT "fm_sprinkler_configs_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."fm_global_tables"("table_id");



ALTER TABLE ONLY "public"."fm_table_vectors"
    ADD CONSTRAINT "fm_table_vectors_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."fm_global_tables"("table_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."ingestion_jobs"
    ADD CONSTRAINT "ingestion_jobs_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."document_metadata"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."issues"
    ADD CONSTRAINT "issues_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."meeting_segments"
    ADD CONSTRAINT "meeting_segments_metadata_id_fkey" FOREIGN KEY ("metadata_id") REFERENCES "public"."document_metadata"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."conversations"("session_id");



ALTER TABLE ONLY "public"."nods_page"
    ADD CONSTRAINT "nods_page_parent_page_id_fkey" FOREIGN KEY ("parent_page_id") REFERENCES "public"."nods_page"("id");



ALTER TABLE ONLY "public"."nods_page_section"
    ADD CONSTRAINT "nods_page_section_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."nods_page"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_project_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."opportunities"
    ADD CONSTRAINT "opportunities_metadata_id_fkey" FOREIGN KEY ("metadata_id") REFERENCES "public"."document_metadata"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."opportunities"
    ADD CONSTRAINT "opportunities_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "public"."meeting_segments"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."opportunities"
    ADD CONSTRAINT "opportunities_source_chunk_id_fkey" FOREIGN KEY ("source_chunk_id") REFERENCES "public"."documents"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."owner_invoice_line_items"
    ADD CONSTRAINT "owner_invoice_line_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."owner_invoices"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."owner_invoices"
    ADD CONSTRAINT "owner_invoices_billing_period_id_fkey" FOREIGN KEY ("billing_period_id") REFERENCES "public"."billing_periods"("id");



ALTER TABLE ONLY "public"."owner_invoices"
    ADD CONSTRAINT "owner_invoices_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_transactions"
    ADD CONSTRAINT "payment_transactions_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_transactions"
    ADD CONSTRAINT "payment_transactions_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."owner_invoices"("id");



ALTER TABLE ONLY "public"."pcco_line_items"
    ADD CONSTRAINT "pcco_line_items_pcco_id_fkey" FOREIGN KEY ("pcco_id") REFERENCES "public"."prime_contract_change_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pcco_line_items"
    ADD CONSTRAINT "pcco_line_items_pco_id_fkey" FOREIGN KEY ("pco_id") REFERENCES "public"."prime_potential_change_orders"("id");



ALTER TABLE ONLY "public"."pco_line_items"
    ADD CONSTRAINT "pco_line_items_change_event_line_item_id_fkey" FOREIGN KEY ("change_event_line_item_id") REFERENCES "public"."change_event_line_items"("id");



ALTER TABLE ONLY "public"."pco_line_items"
    ADD CONSTRAINT "pco_line_items_pco_id_fkey" FOREIGN KEY ("pco_id") REFERENCES "public"."prime_potential_change_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."prime_contract_change_orders"
    ADD CONSTRAINT "prime_contract_change_orders_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."prime_contract_sovs"
    ADD CONSTRAINT "prime_contract_sovs_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."prime_potential_change_orders"
    ADD CONSTRAINT "prime_potential_change_orders_change_event_id_fkey" FOREIGN KEY ("change_event_id") REFERENCES "public"."change_events"("id");



ALTER TABLE ONLY "public"."prime_potential_change_orders"
    ADD CONSTRAINT "prime_potential_change_orders_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."prime_potential_change_orders"
    ADD CONSTRAINT "prime_potential_change_orders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."procore_components"
    ADD CONSTRAINT "procore_components_screenshot_id_fkey" FOREIGN KEY ("screenshot_id") REFERENCES "public"."procore_screenshots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."procore_features"
    ADD CONSTRAINT "procore_features_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."procore_modules"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."procore_screenshots"
    ADD CONSTRAINT "procore_screenshots_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."procore_capture_sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_briefings"
    ADD CONSTRAINT "project_briefings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."project_cost_codes"
    ADD CONSTRAINT "project_cost_codes_cost_code_id_fkey" FOREIGN KEY ("cost_code_id") REFERENCES "public"."cost_codes"("id");



ALTER TABLE ONLY "public"."project_cost_codes"
    ADD CONSTRAINT "project_cost_codes_cost_type_id_fkey" FOREIGN KEY ("cost_type_id") REFERENCES "public"."cost_code_types"("id");



ALTER TABLE ONLY "public"."project_cost_codes"
    ADD CONSTRAINT "project_cost_codes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_directory"
    ADD CONSTRAINT "project_directory_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."project_directory"
    ADD CONSTRAINT "project_directory_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."project_insights"
    ADD CONSTRAINT "project_insights_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_members"
    ADD CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_resources"
    ADD CONSTRAINT "project_resources_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON UPDATE CASCADE ON DELETE SET DEFAULT;



ALTER TABLE ONLY "public"."project_tasks"
    ADD CONSTRAINT "project_tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_users"
    ADD CONSTRAINT "project_users_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_users"
    ADD CONSTRAINT "project_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_budget_locked_by_fkey" FOREIGN KEY ("budget_locked_by") REFERENCES "public"."app_users"("id");



ALTER TABLE ONLY "public"."project"
    ADD CONSTRAINT "projects_budget_locked_by_fkey" FOREIGN KEY ("budget_locked_by") REFERENCES "public"."app_users"("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project"
    ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_project_manager_fkey" FOREIGN KEY ("project_manager") REFERENCES "public"."employees"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."project"
    ADD CONSTRAINT "projects_project_manager_fkey" FOREIGN KEY ("project_manager") REFERENCES "public"."employees"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."prospects"
    ADD CONSTRAINT "prospects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."prospects"
    ADD CONSTRAINT "prospects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."qto_items"
    ADD CONSTRAINT "qto_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."qto_items"
    ADD CONSTRAINT "qto_items_qto_id_fkey" FOREIGN KEY ("qto_id") REFERENCES "public"."qtos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."qtos"
    ADD CONSTRAINT "qtos_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."review_comments"
    ADD CONSTRAINT "review_comments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."review_comments"
    ADD CONSTRAINT "review_comments_discrepancy_id_fkey" FOREIGN KEY ("discrepancy_id") REFERENCES "public"."discrepancies"("id");



ALTER TABLE ONLY "public"."review_comments"
    ADD CONSTRAINT "review_comments_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."submittal_documents"("id");



ALTER TABLE ONLY "public"."review_comments"
    ADD CONSTRAINT "review_comments_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_submittal_id_fkey" FOREIGN KEY ("submittal_id") REFERENCES "public"."submittals"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rfi_assignees"
    ADD CONSTRAINT "rfi_assignees_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rfi_assignees"
    ADD CONSTRAINT "rfi_assignees_rfi_id_fkey" FOREIGN KEY ("rfi_id") REFERENCES "public"."rfis"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rfis"
    ADD CONSTRAINT "rfis_ball_in_court_employee_id_fkey" FOREIGN KEY ("ball_in_court_employee_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."rfis"
    ADD CONSTRAINT "rfis_created_by_employee_id_fkey" FOREIGN KEY ("created_by_employee_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."rfis"
    ADD CONSTRAINT "rfis_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rfis"
    ADD CONSTRAINT "rfis_rfi_manager_employee_id_fkey" FOREIGN KEY ("rfi_manager_employee_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."risks"
    ADD CONSTRAINT "risks_metadata_id_fkey" FOREIGN KEY ("metadata_id") REFERENCES "public"."document_metadata"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."risks"
    ADD CONSTRAINT "risks_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "public"."meeting_segments"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."risks"
    ADD CONSTRAINT "risks_source_chunk_id_fkey" FOREIGN KEY ("source_chunk_id") REFERENCES "public"."documents"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."schedule_of_values"
    ADD CONSTRAINT "schedule_of_values_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."app_users"("id");



ALTER TABLE ONLY "public"."schedule_of_values"
    ADD CONSTRAINT "schedule_of_values_commitment_id_fkey" FOREIGN KEY ("commitment_id") REFERENCES "public"."commitments"("id");



ALTER TABLE ONLY "public"."schedule_of_values"
    ADD CONSTRAINT "schedule_of_values_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id");



ALTER TABLE ONLY "public"."schedule_progress_updates"
    ADD CONSTRAINT "schedule_progress_updates_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."schedule_tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schedule_resources"
    ADD CONSTRAINT "schedule_resources_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."schedule_tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schedule_task_dependencies"
    ADD CONSTRAINT "schedule_task_dependencies_predecessor_task_id_fkey" FOREIGN KEY ("predecessor_task_id") REFERENCES "public"."schedule_tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schedule_task_dependencies"
    ADD CONSTRAINT "schedule_task_dependencies_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."schedule_tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schedule_tasks"
    ADD CONSTRAINT "schedule_tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sov_line_items"
    ADD CONSTRAINT "sov_line_items_sov_id_fkey" FOREIGN KEY ("sov_id") REFERENCES "public"."schedule_of_values"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."specifications"
    ADD CONSTRAINT "specifications_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sub_jobs"
    ADD CONSTRAINT "sub_jobs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subcontractor_contacts"
    ADD CONSTRAINT "subcontractor_contacts_subcontractor_id_fkey" FOREIGN KEY ("subcontractor_id") REFERENCES "public"."subcontractors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subcontractor_documents"
    ADD CONSTRAINT "subcontractor_documents_subcontractor_id_fkey" FOREIGN KEY ("subcontractor_id") REFERENCES "public"."subcontractors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subcontractor_projects"
    ADD CONSTRAINT "subcontractor_projects_subcontractor_id_fkey" FOREIGN KEY ("subcontractor_id") REFERENCES "public"."subcontractors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submittal_analytics_events"
    ADD CONSTRAINT "submittal_analytics_events_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."submittal_analytics_events"
    ADD CONSTRAINT "submittal_analytics_events_submittal_id_fkey" FOREIGN KEY ("submittal_id") REFERENCES "public"."submittals"("id");



ALTER TABLE ONLY "public"."submittal_analytics_events"
    ADD CONSTRAINT "submittal_analytics_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."submittal_documents"
    ADD CONSTRAINT "submittal_documents_submittal_id_fkey" FOREIGN KEY ("submittal_id") REFERENCES "public"."submittals"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submittal_documents"
    ADD CONSTRAINT "submittal_documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."submittal_history"
    ADD CONSTRAINT "submittal_history_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."submittal_history"
    ADD CONSTRAINT "submittal_history_submittal_id_fkey" FOREIGN KEY ("submittal_id") REFERENCES "public"."submittals"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submittal_notifications"
    ADD CONSTRAINT "submittal_notifications_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submittal_notifications"
    ADD CONSTRAINT "submittal_notifications_submittal_id_fkey" FOREIGN KEY ("submittal_id") REFERENCES "public"."submittals"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submittal_notifications"
    ADD CONSTRAINT "submittal_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submittal_performance_metrics"
    ADD CONSTRAINT "submittal_performance_metrics_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."submittals"
    ADD CONSTRAINT "submittals_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submittals"
    ADD CONSTRAINT "submittals_specification_id_fkey" FOREIGN KEY ("specification_id") REFERENCES "public"."specifications"("id");



ALTER TABLE ONLY "public"."submittals"
    ADD CONSTRAINT "submittals_submittal_type_id_fkey" FOREIGN KEY ("submittal_type_id") REFERENCES "public"."submittal_types"("id");



ALTER TABLE ONLY "public"."submittals"
    ADD CONSTRAINT "submittals_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_metadata_id_fkey" FOREIGN KEY ("metadata_id") REFERENCES "public"."document_metadata"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "public"."meeting_segments"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_source_chunk_id_fkey" FOREIGN KEY ("source_chunk_id") REFERENCES "public"."documents"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."todos"
    ADD CONSTRAINT "todos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vertical_markup"
    ADD CONSTRAINT "vertical_markup_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE "private"."document_processing_queue" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Admins can insert conversations" ON "public"."conversations" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can insert messages" ON "public"."messages" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can insert requests" ON "public"."requests" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can update all conversations" ON "public"."conversations" FOR UPDATE USING ("public"."is_admin"());



CREATE POLICY "Admins can update all profiles" ON "public"."user_profiles" FOR UPDATE USING ("public"."is_admin"());



CREATE POLICY "Admins can view all conversations" ON "public"."conversations" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admins can view all messages" ON "public"."messages" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admins can view all profiles" ON "public"."user_profiles" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admins can view all requests" ON "public"."requests" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admins manage document_group_access" ON "public"."document_group_access" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins manage document_user_access" ON "public"."document_user_access" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Allow anon users to view ai_insights" ON "public"."ai_insights" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Allow authenticated users full access to ai_insights" ON "public"."ai_insights" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users select" ON "public"."clients" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users select" ON "public"."companies" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users select" ON "public"."nods_page" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users select" ON "public"."nods_page_section" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users select" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users select" ON "public"."project_tasks" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users select" ON "public"."projects" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users select" ON "public"."sync_status" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to delete employees" ON "public"."employees" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to insert employees" ON "public"."employees" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated users to read and update" ON "public"."archon_settings" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to read and update archon_project_sou" ON "public"."archon_project_sources" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to read and update archon_projects" ON "public"."archon_projects" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to read and update archon_tasks" ON "public"."archon_tasks" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to read archon_document_versions" ON "public"."archon_document_versions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to read archon_prompts" ON "public"."archon_prompts" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to update employees" ON "public"."employees" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow public access on asrs_configurations" ON "public"."asrs_configurations" USING (true);



CREATE POLICY "Allow public access on cost_factors" ON "public"."cost_factors" USING (true);



CREATE POLICY "Allow public access on projects" ON "public"."user_projects" USING (true);



CREATE POLICY "Allow public access on recommendations" ON "public"."design_recommendations" USING (true);



CREATE POLICY "Allow public read access" ON "public"."fm_table_vectors" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on fm_blocks" ON "public"."fm_blocks" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on fm_sections" ON "public"."fm_sections" FOR SELECT USING (("is_visible" = true));



CREATE POLICY "Allow public read access to archon_code_examples" ON "public"."archon_code_examples" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to archon_crawled_pages" ON "public"."archon_crawled_pages" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to archon_sources" ON "public"."archon_sources" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to code_examples" ON "public"."code_examples" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to crawled_pages" ON "public"."crawled_pages" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to sources" ON "public"."sources" FOR SELECT USING (true);



CREATE POLICY "Allow public to view employees" ON "public"."employees" FOR SELECT USING (true);



CREATE POLICY "Allow service role full access" ON "public"."archon_settings" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Allow service role full access to archon_document_versions" ON "public"."archon_document_versions" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Allow service role full access to archon_project_sources" ON "public"."archon_project_sources" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Allow service role full access to archon_projects" ON "public"."archon_projects" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Allow service role full access to archon_prompts" ON "public"."archon_prompts" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Allow service role full access to archon_tasks" ON "public"."archon_tasks" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Authenticated users can insert subcontractors" ON "public"."subcontractors" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can manage submittals" ON "public"."submittals" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can update subcontractors" ON "public"."subcontractors" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view subcontractors" ON "public"."subcontractors" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Deny delete for conversations" ON "public"."conversations" FOR DELETE USING (false);



CREATE POLICY "Deny delete for messages" ON "public"."messages" FOR DELETE USING (false);



CREATE POLICY "Deny delete for requests" ON "public"."requests" FOR DELETE USING (false);



CREATE POLICY "Deny delete for user_profiles" ON "public"."user_profiles" FOR DELETE USING (false);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."employees" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."document_chunks" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."documents" FOR SELECT USING (true);



CREATE POLICY "Enable write access for authenticated users" ON "public"."document_chunks" USING ((("auth"."role"() = 'authenticated'::"text") OR ("auth"."role"() = 'service_role'::"text")));



CREATE POLICY "Figures are viewable by anonymous users" ON "public"."fm_global_figures" FOR SELECT USING (true);



CREATE POLICY "Figures are viewable by authenticated users" ON "public"."fm_global_figures" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Individuals can create todos." ON "public"."todos" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Individuals can delete their own todos." ON "public"."todos" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Individuals can update their own todos." ON "public"."todos" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Individuals can view their own todos. " ON "public"."todos" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Only admins can change admin status" ON "public"."user_profiles" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



ALTER TABLE "public"."Prospects" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Service role can insert users" ON "public"."app_users" FOR INSERT WITH CHECK (true);



CREATE POLICY "Service role can manage all users" ON "public"."app_users" USING (true) WITH CHECK (true);



CREATE POLICY "Service role has full access" ON "public"."documents" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Service role has full access to project_tasks" ON "public"."project_tasks" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Users can insert messages in their conversations" ON "public"."messages" FOR INSERT WITH CHECK (("auth"."uid"() = "computed_session_user_id"));



CREATE POLICY "Users can insert their own conversations" ON "public"."conversations" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can manage SOV line items" ON "public"."sov_line_items" USING (true);



CREATE POLICY "Users can manage SOVs for their projects" ON "public"."schedule_of_values" USING (true);



CREATE POLICY "Users can manage billing periods" ON "public"."billing_periods" USING (true);



CREATE POLICY "Users can manage project directory" ON "public"."project_directory" USING (true);



CREATE POLICY "Users can manage vertical markup" ON "public"."vertical_markup" USING (true);



CREATE POLICY "Users can read own data" ON "public"."app_users" FOR SELECT USING (true);



CREATE POLICY "Users can read text chunks" ON "public"."fm_text_chunks" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Users can update own data" ON "public"."app_users" FOR UPDATE USING (true);



CREATE POLICY "Users can update own profile" ON "public"."users" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update their own conversations" ON "public"."conversations" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile" ON "public"."user_profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK ((("auth"."uid"() = "id") AND (NOT ("is_admin" IS DISTINCT FROM false))));



CREATE POLICY "Users can view SOV line items" ON "public"."sov_line_items" FOR SELECT USING (true);



CREATE POLICY "Users can view SOVs for their projects" ON "public"."schedule_of_values" FOR SELECT USING (true);



CREATE POLICY "Users can view billing periods" ON "public"."billing_periods" FOR SELECT USING (true);



CREATE POLICY "Users can view own profile" ON "public"."users" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view project directory" ON "public"."project_directory" FOR SELECT USING (true);



CREATE POLICY "Users can view their own conversations" ON "public"."conversations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own messages" ON "public"."messages" FOR SELECT USING (("auth"."uid"() = "computed_session_user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."user_profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own requests" ON "public"."requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view vertical markup" ON "public"."vertical_markup" FOR SELECT USING (true);



CREATE POLICY "admin_all_access" ON "public"."document_metadata" TO "authenticated" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "ai_insights_select_project_visible" ON "public"."ai_insights" FOR SELECT TO "authenticated" USING ((("project_id" IS NULL) OR (EXISTS ( SELECT 1
   FROM "public"."projects" "p"
  WHERE (("p"."id" = "ai_insights"."project_id") AND (("p"."archived" = false) OR ("p"."archived_by" = ( SELECT "auth"."uid"() AS "uid"))))))));



ALTER TABLE "public"."app_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."archon_code_examples" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."archon_crawled_pages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."archon_document_versions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."archon_project_sources" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."archon_prompts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."archon_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."archon_sources" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."archon_tasks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."asrs_protection_rules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."billing_periods" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."budget_codes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "budget_codes_read" ON "public"."budget_codes" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "budget_codes_write" ON "public"."budget_codes" USING (("auth"."uid"() IS NOT NULL));



ALTER TABLE "public"."budget_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "budget_items_modify" ON "public"."budget_items" USING (("auth"."uid"() IS NOT NULL)) WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "budget_items_select" ON "public"."budget_items" FOR SELECT USING (true);



ALTER TABLE "public"."budget_line_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "budget_line_items_read" ON "public"."budget_line_items" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "budget_line_items_write" ON "public"."budget_line_items" USING (("auth"."uid"() IS NOT NULL));



ALTER TABLE "public"."budget_modifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "budget_modifications_modify" ON "public"."budget_modifications" USING (("auth"."uid"() IS NOT NULL)) WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "budget_modifications_select" ON "public"."budget_modifications" FOR SELECT USING (true);



ALTER TABLE "public"."budget_snapshots" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "budget_snapshots_read" ON "public"."budget_snapshots" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "budget_snapshots_write" ON "public"."budget_snapshots" USING (("auth"."uid"() IS NOT NULL));



ALTER TABLE "public"."change_order_line_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "change_order_line_items_read" ON "public"."change_order_line_items" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "change_order_line_items_write" ON "public"."change_order_line_items" USING (("auth"."uid"() IS NOT NULL));



ALTER TABLE "public"."chat_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."code_examples" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."conversations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cost_factors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."crawled_pages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."design_recommendations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."direct_cost_line_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "direct_cost_line_items_read" ON "public"."direct_cost_line_items" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "direct_cost_line_items_write" ON "public"."direct_cost_line_items" USING (("auth"."uid"() IS NOT NULL));



ALTER TABLE "public"."document_chunks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."document_group_access" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."document_user_access" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."employees" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fm_blocks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fm_global_figures" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fm_sections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fm_table_vectors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fm_text_chunks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "leadership_access" ON "public"."document_metadata" FOR SELECT TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'leadership'::"text") AND ("access_level" = ANY (ARRAY['leadership'::"text", 'team'::"text"]))));



CREATE POLICY "leadership_delete" ON "public"."document_metadata" FOR DELETE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'leadership'::"text") AND ("access_level" = ANY (ARRAY['leadership'::"text", 'team'::"text"]))));



CREATE POLICY "leadership_insert" ON "public"."document_metadata" FOR INSERT TO "authenticated" WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'leadership'::"text") AND ("access_level" = ANY (ARRAY['leadership'::"text", 'team'::"text"]))));



CREATE POLICY "leadership_update" ON "public"."document_metadata" FOR UPDATE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'leadership'::"text") AND ("access_level" = ANY (ARRAY['leadership'::"text", 'team'::"text"])))) WITH CHECK (("access_level" = ANY (ARRAY['leadership'::"text", 'team'::"text"])));



ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nods_page" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nods_page_section" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."processing_queue" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."project_directory" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."project_members" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "project_members_admin_update" ON "public"."project_members" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."project_members" "pm2"
  WHERE (("pm2"."project_id" = "project_members"."project_id") AND ("pm2"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("pm2"."access" = ANY (ARRAY['owner'::"text", 'admin'::"text"]))))));



CREATE POLICY "project_members_insert_for_authenticated" ON "public"."project_members" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "project_members_select_own" ON "public"."project_members" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "project_members_update_own" ON "public"."project_members" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."project_resources" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."project_tasks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "projects_insert_authenticated" ON "public"."projects" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "projects_select_for_members" ON "public"."projects" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."project_members" "pm"
  WHERE (("pm"."project_id" = "projects"."id") AND ("pm"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "projects_select_member_unarchived" ON "public"."projects" FOR SELECT TO "authenticated" USING ((((EXISTS ( SELECT 1
   FROM "public"."project_members" "pm"
  WHERE (("pm"."project_id" = "projects"."id") AND ("pm"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) AND ("archived" = false)) OR ("archived_by" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "projects_update_for_members" ON "public"."projects" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."project_members" "pm"
  WHERE (("pm"."project_id" = "projects"."id") AND ("pm"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("pm"."access" = ANY (ARRAY['admin'::"text", 'editor'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."project_members" "pm"
  WHERE (("pm"."project_id" = "projects"."id") AND ("pm"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("pm"."access" = 'admin'::"text")))));



CREATE POLICY "projects_update_unarchive_admin" ON "public"."projects" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."project_members" "pm"
  WHERE (("pm"."project_id" = "projects"."id") AND ("pm"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("pm"."access" = ANY (ARRAY['owner'::"text", 'admin'::"text"])))))) WITH CHECK ((("archived" = false) OR (("archived" = false) OR (EXISTS ( SELECT 1
   FROM "public"."project_members" "pm"
  WHERE (("pm"."project_id" = "projects"."id") AND ("pm"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("pm"."access" = ANY (ARRAY['owner'::"text", 'admin'::"text"]))))))));



ALTER TABLE "public"."rag_pipeline_state" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schedule_of_values" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sources" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sov_line_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sub_jobs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "sub_jobs_read" ON "public"."sub_jobs" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "sub_jobs_write" ON "public"."sub_jobs" USING (("auth"."uid"() IS NOT NULL));



ALTER TABLE "public"."subcontractors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."submittals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sync_status" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "team_access" ON "public"."document_metadata" FOR SELECT TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'team'::"text") AND ("access_level" = 'team'::"text")));



CREATE POLICY "team_insert" ON "public"."document_metadata" FOR INSERT TO "authenticated" WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'team'::"text") AND ("access_level" = 'team'::"text")));



CREATE POLICY "team_update" ON "public"."document_metadata" FOR UPDATE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'team'::"text") AND ("access_level" = 'team'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'team'::"text") AND ("access_level" = 'team'::"text")));



ALTER TABLE "public"."todos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_projects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_can_read_docs" ON "public"."document_metadata" FOR SELECT TO "authenticated" USING ((("access_level" = 'team'::"text") OR ("id" IN ( SELECT "document_user_access"."document_id"
   FROM "public"."document_user_access"
  WHERE ("document_user_access"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



ALTER TABLE "public"."vertical_markup" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "zapier_access_policy" ON "public"."document_metadata" TO "zapier" USING (true) WITH CHECK (true);



CREATE POLICY "zapier_full_access" ON "public"."document_metadata" TO "zapier" USING (true) WITH CHECK (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";








GRANT USAGE ON SCHEMA "next_auth" TO "service_role";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT USAGE ON SCHEMA "public" TO "zapier";



GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_in"("cstring", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_in"("cstring", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_in"("cstring", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_in"("cstring", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_out"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_out"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_out"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_out"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_recv"("internal", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_recv"("internal", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_recv"("internal", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_recv"("internal", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_send"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_send"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_send"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_send"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_typmod_in"("cstring"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."lquery_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."lquery_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."lquery_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lquery_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."lquery_out"("public"."lquery") TO "postgres";
GRANT ALL ON FUNCTION "public"."lquery_out"("public"."lquery") TO "anon";
GRANT ALL ON FUNCTION "public"."lquery_out"("public"."lquery") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lquery_out"("public"."lquery") TO "service_role";



GRANT ALL ON FUNCTION "public"."lquery_recv"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."lquery_recv"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."lquery_recv"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lquery_recv"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."lquery_send"("public"."lquery") TO "postgres";
GRANT ALL ON FUNCTION "public"."lquery_send"("public"."lquery") TO "anon";
GRANT ALL ON FUNCTION "public"."lquery_send"("public"."lquery") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lquery_send"("public"."lquery") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_out"("public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_out"("public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_out"("public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_out"("public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_recv"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_recv"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_recv"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_recv"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_send"("public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_send"("public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_send"("public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_send"("public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_gist_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_gist_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_gist_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_gist_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_gist_out"("public"."ltree_gist") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_gist_out"("public"."ltree_gist") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_gist_out"("public"."ltree_gist") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_gist_out"("public"."ltree_gist") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltxtq_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltxtq_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."ltxtq_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltxtq_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltxtq_out"("public"."ltxtquery") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltxtq_out"("public"."ltxtquery") TO "anon";
GRANT ALL ON FUNCTION "public"."ltxtq_out"("public"."ltxtquery") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltxtq_out"("public"."ltxtquery") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltxtq_recv"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltxtq_recv"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ltxtq_recv"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltxtq_recv"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltxtq_send"("public"."ltxtquery") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltxtq_send"("public"."ltxtquery") TO "anon";
GRANT ALL ON FUNCTION "public"."ltxtq_send"("public"."ltxtquery") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltxtq_send"("public"."ltxtquery") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_in"("cstring", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_in"("cstring", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_in"("cstring", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_in"("cstring", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_out"("public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_out"("public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_out"("public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_out"("public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_recv"("internal", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_recv"("internal", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_recv"("internal", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_recv"("internal", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_send"("public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_send"("public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_send"("public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_send"("public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_typmod_in"("cstring"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_halfvec"(real[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(real[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(real[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(real[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(real[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(real[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(real[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(real[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_halfvec"(double precision[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(double precision[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(double precision[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(double precision[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(double precision[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(double precision[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(double precision[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(double precision[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_halfvec"(integer[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(integer[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(integer[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(integer[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(integer[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(integer[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(integer[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(integer[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_halfvec"(numeric[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(numeric[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(numeric[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(numeric[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(numeric[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(numeric[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(numeric[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(numeric[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_to_float4"("public"."halfvec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_to_float4"("public"."halfvec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_to_float4"("public"."halfvec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_to_float4"("public"."halfvec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec"("public"."halfvec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec"("public"."halfvec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec"("public"."halfvec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec"("public"."halfvec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_to_sparsevec"("public"."halfvec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_to_sparsevec"("public"."halfvec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_to_sparsevec"("public"."halfvec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_to_sparsevec"("public"."halfvec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_to_vector"("public"."halfvec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_to_vector"("public"."halfvec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_to_vector"("public"."halfvec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_to_vector"("public"."halfvec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_to_halfvec"("public"."sparsevec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_to_halfvec"("public"."sparsevec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_to_halfvec"("public"."sparsevec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_to_halfvec"("public"."sparsevec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec"("public"."sparsevec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec"("public"."sparsevec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec"("public"."sparsevec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec"("public"."sparsevec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_to_vector"("public"."sparsevec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_to_vector"("public"."sparsevec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_to_vector"("public"."sparsevec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_to_vector"("public"."sparsevec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_to_halfvec"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_to_halfvec"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_to_halfvec"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_to_halfvec"("public"."vector", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_to_sparsevec"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_to_sparsevec"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_to_sparsevec"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_to_sparsevec"("public"."vector", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "service_role";





















































































































































































































































































































GRANT ALL ON FUNCTION "public"."_ai_insights_counts_trigger_fn"() TO "service_role";
GRANT ALL ON FUNCTION "public"."_ai_insights_counts_trigger_fn"() TO "anon";
GRANT ALL ON FUNCTION "public"."_ai_insights_counts_trigger_fn"() TO "authenticated";



GRANT ALL ON FUNCTION "public"."_lt_q_regex"("public"."ltree"[], "public"."lquery"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."_lt_q_regex"("public"."ltree"[], "public"."lquery"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."_lt_q_regex"("public"."ltree"[], "public"."lquery"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_lt_q_regex"("public"."ltree"[], "public"."lquery"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."_lt_q_rregex"("public"."lquery"[], "public"."ltree"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."_lt_q_rregex"("public"."lquery"[], "public"."ltree"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."_lt_q_rregex"("public"."lquery"[], "public"."ltree"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_lt_q_rregex"("public"."lquery"[], "public"."ltree"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltq_extract_regex"("public"."ltree"[], "public"."lquery") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltq_extract_regex"("public"."ltree"[], "public"."lquery") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltq_extract_regex"("public"."ltree"[], "public"."lquery") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltq_extract_regex"("public"."ltree"[], "public"."lquery") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltq_regex"("public"."ltree"[], "public"."lquery") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltq_regex"("public"."ltree"[], "public"."lquery") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltq_regex"("public"."ltree"[], "public"."lquery") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltq_regex"("public"."ltree"[], "public"."lquery") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltq_rregex"("public"."lquery", "public"."ltree"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltq_rregex"("public"."lquery", "public"."ltree"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."_ltq_rregex"("public"."lquery", "public"."ltree"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltq_rregex"("public"."lquery", "public"."ltree"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_compress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_consistent"("internal", "public"."ltree"[], smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_consistent"("internal", "public"."ltree"[], smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_consistent"("internal", "public"."ltree"[], smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_consistent"("internal", "public"."ltree"[], smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_extract_isparent"("public"."ltree"[], "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_extract_isparent"("public"."ltree"[], "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_extract_isparent"("public"."ltree"[], "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_extract_isparent"("public"."ltree"[], "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_extract_risparent"("public"."ltree"[], "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_extract_risparent"("public"."ltree"[], "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_extract_risparent"("public"."ltree"[], "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_extract_risparent"("public"."ltree"[], "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_gist_options"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_gist_options"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_gist_options"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_gist_options"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_isparent"("public"."ltree"[], "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_isparent"("public"."ltree"[], "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_isparent"("public"."ltree"[], "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_isparent"("public"."ltree"[], "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_penalty"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_picksplit"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_r_isparent"("public"."ltree", "public"."ltree"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_r_isparent"("public"."ltree", "public"."ltree"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_r_isparent"("public"."ltree", "public"."ltree"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_r_isparent"("public"."ltree", "public"."ltree"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_r_risparent"("public"."ltree", "public"."ltree"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_r_risparent"("public"."ltree", "public"."ltree"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_r_risparent"("public"."ltree", "public"."ltree"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_r_risparent"("public"."ltree", "public"."ltree"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_risparent"("public"."ltree"[], "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_risparent"("public"."ltree"[], "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_risparent"("public"."ltree"[], "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_risparent"("public"."ltree"[], "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_same"("public"."ltree_gist", "public"."ltree_gist", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_same"("public"."ltree_gist", "public"."ltree_gist", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_same"("public"."ltree_gist", "public"."ltree_gist", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_same"("public"."ltree_gist", "public"."ltree_gist", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltree_union"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltree_union"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltree_union"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltree_union"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltxtq_exec"("public"."ltree"[], "public"."ltxtquery") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltxtq_exec"("public"."ltree"[], "public"."ltxtquery") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltxtq_exec"("public"."ltree"[], "public"."ltxtquery") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltxtq_exec"("public"."ltree"[], "public"."ltxtquery") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltxtq_extract_exec"("public"."ltree"[], "public"."ltxtquery") TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltxtq_extract_exec"("public"."ltree"[], "public"."ltxtquery") TO "anon";
GRANT ALL ON FUNCTION "public"."_ltxtq_extract_exec"("public"."ltree"[], "public"."ltxtquery") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltxtq_extract_exec"("public"."ltree"[], "public"."ltxtquery") TO "service_role";



GRANT ALL ON FUNCTION "public"."_ltxtq_rexec"("public"."ltxtquery", "public"."ltree"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."_ltxtq_rexec"("public"."ltxtquery", "public"."ltree"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."_ltxtq_rexec"("public"."ltxtquery", "public"."ltree"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_ltxtq_rexec"("public"."ltxtquery", "public"."ltree"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."add_meeting_participants_to_contacts"() TO "anon";
GRANT ALL ON FUNCTION "public"."add_meeting_participants_to_contacts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_meeting_participants_to_contacts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."ai_insights_exact_quotes_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."ai_insights_exact_quotes_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."ai_insights_exact_quotes_trigger"() TO "service_role";



GRANT ALL ON FUNCTION "public"."archive_task"("task_id_param" "uuid", "archived_by_param" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."archive_task"("task_id_param" "uuid", "archived_by_param" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."archive_task"("task_id_param" "uuid", "archived_by_param" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."assign_meeting_project_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."assign_meeting_project_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."assign_meeting_project_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_archive_old_chats"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_archive_old_chats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_archive_old_chats"() TO "service_role";



GRANT ALL ON FUNCTION "public"."backfill_meeting_participants_to_contacts"() TO "anon";
GRANT ALL ON FUNCTION "public"."backfill_meeting_participants_to_contacts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."backfill_meeting_participants_to_contacts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."batch_update_project_assignments"("p_assignments" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."batch_update_project_assignments"("p_assignments" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."batch_update_project_assignments"("p_assignments" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."compare_budget_snapshots"("p_snapshot_id_1" "uuid", "p_snapshot_id_2" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."compare_budget_snapshots"("p_snapshot_id_1" "uuid", "p_snapshot_id_2" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."compare_budget_snapshots"("p_snapshot_id_1" "uuid", "p_snapshot_id_2" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."convert_embeddings_to_vector"() TO "anon";
GRANT ALL ON FUNCTION "public"."convert_embeddings_to_vector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."convert_embeddings_to_vector"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_budget_snapshot"("p_project_id" bigint, "p_snapshot_name" character varying, "p_snapshot_type" character varying, "p_description" "text", "p_is_baseline" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."create_budget_snapshot"("p_project_id" bigint, "p_snapshot_name" character varying, "p_snapshot_type" character varying, "p_description" "text", "p_is_baseline" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_budget_snapshot"("p_project_id" bigint, "p_snapshot_name" character varying, "p_snapshot_type" character varying, "p_description" "text", "p_is_baseline" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."create_conversation_with_message"("p_title" "text", "p_agent_type" "text", "p_role" "text", "p_content" "text", "p_metadata" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."create_conversation_with_message"("p_title" "text", "p_agent_type" "text", "p_role" "text", "p_content" "text", "p_metadata" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_conversation_with_message"("p_title" "text", "p_agent_type" "text", "p_role" "text", "p_content" "text", "p_metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."document_metadata_set_category"() TO "anon";
GRANT ALL ON FUNCTION "public"."document_metadata_set_category"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."document_metadata_set_category"() TO "service_role";



GRANT ALL ON FUNCTION "public"."email_to_names"("email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."email_to_names"("email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."email_to_names"("email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."enhanced_match_chunks"("query_embedding" "public"."vector", "match_count" integer, "project_filter" integer, "date_after" timestamp without time zone, "doc_type_filter" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."enhanced_match_chunks"("query_embedding" "public"."vector", "match_count" integer, "project_filter" integer, "date_after" timestamp without time zone, "doc_type_filter" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."enhanced_match_chunks"("query_embedding" "public"."vector", "match_count" integer, "project_filter" integer, "date_after" timestamp without time zone, "doc_type_filter" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."execute_custom_sql"("sql_query" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."execute_custom_sql"("sql_query" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."execute_custom_sql"("sql_query" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."extract_names"("participant" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."extract_names"("participant" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."extract_names"("participant" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."find_duplicate_insights"("p_similarity_threshold" numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."find_duplicate_insights"("p_similarity_threshold" numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_duplicate_insights"("p_similarity_threshold" numeric) TO "service_role";



GRANT ALL ON FUNCTION "public"."find_sprinkler_requirements"("p_asrs_type" "text", "p_system_type" "text", "p_ceiling_height_ft" numeric, "p_commodity_class" "text", "p_tolerance_ft" numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."find_sprinkler_requirements"("p_asrs_type" "text", "p_system_type" "text", "p_ceiling_height_ft" numeric, "p_commodity_class" "text", "p_tolerance_ft" numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_sprinkler_requirements"("p_asrs_type" "text", "p_system_type" "text", "p_ceiling_height_ft" numeric, "p_commodity_class" "text", "p_tolerance_ft" numeric) TO "service_role";



GRANT ALL ON FUNCTION "public"."find_sprinkler_requirements"("p_asrs_type" character varying, "p_system_type" character varying, "p_ceiling_height_ft" integer, "p_commodity_class" character varying, "p_k_factor" numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."find_sprinkler_requirements"("p_asrs_type" character varying, "p_system_type" character varying, "p_ceiling_height_ft" integer, "p_commodity_class" character varying, "p_k_factor" numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_sprinkler_requirements"("p_asrs_type" character varying, "p_system_type" character varying, "p_ceiling_height_ft" integer, "p_commodity_class" character varying, "p_k_factor" numeric) TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_log_projects_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."fn_log_projects_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_log_projects_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_propagate_division_title_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."fn_propagate_division_title_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_propagate_division_title_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_sync_cost_code_division_title"() TO "anon";
GRANT ALL ON FUNCTION "public"."fn_sync_cost_code_division_title"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_sync_cost_code_division_title"() TO "service_role";



GRANT ALL ON FUNCTION "public"."full_text_search_meetings"("search_query" "text", "match_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."full_text_search_meetings"("search_query" "text", "match_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."full_text_search_meetings"("search_query" "text", "match_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_optimization_recommendations"("project_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_optimization_recommendations"("project_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_optimization_recommendations"("project_data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_optimizations"("p_user_input" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_optimizations"("p_user_input" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_optimizations"("p_user_input" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_project_documents"("in_project_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_project_documents"("in_project_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_project_documents"("in_project_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_asrs_figure_options"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_asrs_figure_options"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_asrs_figure_options"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_conversation_with_history"("p_conversation_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_conversation_with_history"("p_conversation_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_conversation_with_history"("p_conversation_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_document_chunks"("doc_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_document_chunks"("doc_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_document_chunks"("doc_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_document_insights_page"("in_page_size" integer, "in_search" "text", "in_sort_by" "text", "in_sort_dir" "text", "in_cursor_created_at" timestamp with time zone, "in_cursor_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_document_insights_page"("in_page_size" integer, "in_search" "text", "in_sort_by" "text", "in_sort_dir" "text", "in_cursor_created_at" timestamp with time zone, "in_cursor_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_document_insights_page"("in_page_size" integer, "in_search" "text", "in_sort_by" "text", "in_sort_dir" "text", "in_cursor_created_at" timestamp with time zone, "in_cursor_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_figures_by_config"("p_asrs_type" character varying, "p_container_type" character varying, "p_orientation_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."get_figures_by_config"("p_asrs_type" character varying, "p_container_type" character varying, "p_orientation_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_figures_by_config"("p_asrs_type" character varying, "p_container_type" character varying, "p_orientation_type" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_fm_global_references_by_topic"("topic" "text", "limit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_fm_global_references_by_topic"("topic" "text", "limit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_fm_global_references_by_topic"("topic" "text", "limit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_insights_processing_stats"("p_days_back" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_insights_processing_stats"("p_days_back" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_insights_processing_stats"("p_days_back" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_meeting_analytics"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_meeting_analytics"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_meeting_analytics"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_meeting_frequency_stats"("p_days_back" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_meeting_frequency_stats"("p_days_back" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_meeting_frequency_stats"("p_days_back" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_meeting_statistics"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_meeting_statistics"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_meeting_statistics"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_page_parents"("page_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_page_parents"("page_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_page_parents"("page_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_pending_documents"("p_limit" integer, "p_project_id" bigint, "p_date_from" timestamp with time zone, "p_date_to" timestamp with time zone, "p_category" "text", "p_exclude_processed" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."get_pending_documents"("p_limit" integer, "p_project_id" bigint, "p_date_from" timestamp with time zone, "p_date_to" timestamp with time zone, "p_category" "text", "p_exclude_processed" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_pending_documents"("p_limit" integer, "p_project_id" bigint, "p_date_from" timestamp with time zone, "p_date_to" timestamp with time zone, "p_category" "text", "p_exclude_processed" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_priority_insights"("p_project_id" integer, "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_priority_insights"("p_project_id" integer, "p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_priority_insights"("p_project_id" integer, "p_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_project_documents_page"("in_page_size" integer, "in_search" "text", "in_sort_by" "text", "in_sort_dir" "text", "in_cursor_date" timestamp with time zone, "in_cursor_id" "text", "in_project_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_project_documents_page"("in_page_size" integer, "in_search" "text", "in_sort_by" "text", "in_sort_dir" "text", "in_cursor_date" timestamp with time zone, "in_cursor_id" "text", "in_project_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_project_documents_page"("in_page_size" integer, "in_search" "text", "in_sort_by" "text", "in_sort_dir" "text", "in_cursor_date" timestamp with time zone, "in_cursor_id" "text", "in_project_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_project_matching_context"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_project_matching_context"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_project_matching_context"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_projects_needing_summary_update"("hours_threshold" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_projects_needing_summary_update"("hours_threshold" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_projects_needing_summary_update"("hours_threshold" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_recent_project_insights"("p_project_id" "uuid", "p_days_back" integer, "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_recent_project_insights"("p_project_id" "uuid", "p_days_back" integer, "p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_recent_project_insights"("p_project_id" "uuid", "p_days_back" integer, "p_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_related_content"("chunk_id" "uuid", "max_results" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_related_content"("chunk_id" "uuid", "max_results" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_related_content"("chunk_id" "uuid", "max_results" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_chat_stats"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_chat_stats"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_chat_stats"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_btree_consistent"("internal", smallint, "anyelement", integer, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_btree_consistent"("internal", smallint, "anyelement", integer, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_btree_consistent"("internal", smallint, "anyelement", integer, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_btree_consistent"("internal", smallint, "anyelement", integer, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_anyenum"("anyenum", "anyenum", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_anyenum"("anyenum", "anyenum", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_anyenum"("anyenum", "anyenum", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_anyenum"("anyenum", "anyenum", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bit"(bit, bit, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bit"(bit, bit, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bit"(bit, bit, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bit"(bit, bit, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bool"(boolean, boolean, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bool"(boolean, boolean, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bool"(boolean, boolean, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bool"(boolean, boolean, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bpchar"(character, character, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bpchar"(character, character, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bpchar"(character, character, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bpchar"(character, character, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bytea"("bytea", "bytea", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bytea"("bytea", "bytea", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bytea"("bytea", "bytea", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_bytea"("bytea", "bytea", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_char"("char", "char", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_char"("char", "char", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_char"("char", "char", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_char"("char", "char", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_cidr"("cidr", "cidr", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_cidr"("cidr", "cidr", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_cidr"("cidr", "cidr", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_cidr"("cidr", "cidr", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_date"("date", "date", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_date"("date", "date", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_date"("date", "date", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_date"("date", "date", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_float4"(real, real, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_float4"(real, real, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_float4"(real, real, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_float4"(real, real, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_float8"(double precision, double precision, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_float8"(double precision, double precision, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_float8"(double precision, double precision, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_float8"(double precision, double precision, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_inet"("inet", "inet", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_inet"("inet", "inet", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_inet"("inet", "inet", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_inet"("inet", "inet", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_int2"(smallint, smallint, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_int2"(smallint, smallint, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_int2"(smallint, smallint, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_int2"(smallint, smallint, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_int4"(integer, integer, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_int4"(integer, integer, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_int4"(integer, integer, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_int4"(integer, integer, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_int8"(bigint, bigint, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_int8"(bigint, bigint, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_int8"(bigint, bigint, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_int8"(bigint, bigint, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_interval"(interval, interval, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_interval"(interval, interval, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_interval"(interval, interval, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_interval"(interval, interval, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_macaddr"("macaddr", "macaddr", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_macaddr"("macaddr", "macaddr", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_macaddr"("macaddr", "macaddr", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_macaddr"("macaddr", "macaddr", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_macaddr8"("macaddr8", "macaddr8", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_macaddr8"("macaddr8", "macaddr8", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_macaddr8"("macaddr8", "macaddr8", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_macaddr8"("macaddr8", "macaddr8", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_money"("money", "money", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_money"("money", "money", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_money"("money", "money", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_money"("money", "money", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_name"("name", "name", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_name"("name", "name", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_name"("name", "name", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_name"("name", "name", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_numeric"(numeric, numeric, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_numeric"(numeric, numeric, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_numeric"(numeric, numeric, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_numeric"(numeric, numeric, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_oid"("oid", "oid", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_oid"("oid", "oid", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_oid"("oid", "oid", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_oid"("oid", "oid", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_text"("text", "text", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_text"("text", "text", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_text"("text", "text", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_text"("text", "text", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_time"(time without time zone, time without time zone, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_time"(time without time zone, time without time zone, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_time"(time without time zone, time without time zone, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_time"(time without time zone, time without time zone, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_timestamp"(timestamp without time zone, timestamp without time zone, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_timestamp"(timestamp without time zone, timestamp without time zone, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_timestamp"(timestamp without time zone, timestamp without time zone, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_timestamp"(timestamp without time zone, timestamp without time zone, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_timestamptz"(timestamp with time zone, timestamp with time zone, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_timestamptz"(timestamp with time zone, timestamp with time zone, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_timestamptz"(timestamp with time zone, timestamp with time zone, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_timestamptz"(timestamp with time zone, timestamp with time zone, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_timetz"(time with time zone, time with time zone, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_timetz"(time with time zone, time with time zone, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_timetz"(time with time zone, time with time zone, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_timetz"(time with time zone, time with time zone, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_uuid"("uuid", "uuid", smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_uuid"("uuid", "uuid", smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_uuid"("uuid", "uuid", smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_uuid"("uuid", "uuid", smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_compare_prefix_varbit"(bit varying, bit varying, smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_varbit"(bit varying, bit varying, smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_varbit"(bit varying, bit varying, smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_compare_prefix_varbit"(bit varying, bit varying, smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_enum_cmp"("anyenum", "anyenum") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_enum_cmp"("anyenum", "anyenum") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_enum_cmp"("anyenum", "anyenum") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_enum_cmp"("anyenum", "anyenum") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_anyenum"("anyenum", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_anyenum"("anyenum", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_anyenum"("anyenum", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_anyenum"("anyenum", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_bit"(bit, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_bit"(bit, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_bit"(bit, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_bit"(bit, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_bool"(boolean, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_bool"(boolean, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_bool"(boolean, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_bool"(boolean, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_bpchar"(character, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_bpchar"(character, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_bpchar"(character, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_bpchar"(character, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_bytea"("bytea", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_bytea"("bytea", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_bytea"("bytea", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_bytea"("bytea", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_char"("char", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_char"("char", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_char"("char", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_char"("char", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_cidr"("cidr", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_cidr"("cidr", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_cidr"("cidr", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_cidr"("cidr", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_date"("date", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_date"("date", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_date"("date", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_date"("date", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_float4"(real, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_float4"(real, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_float4"(real, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_float4"(real, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_float8"(double precision, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_float8"(double precision, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_float8"(double precision, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_float8"(double precision, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_inet"("inet", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_inet"("inet", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_inet"("inet", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_inet"("inet", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_int2"(smallint, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_int2"(smallint, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_int2"(smallint, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_int2"(smallint, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_int4"(integer, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_int4"(integer, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_int4"(integer, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_int4"(integer, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_int8"(bigint, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_int8"(bigint, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_int8"(bigint, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_int8"(bigint, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_interval"(interval, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_interval"(interval, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_interval"(interval, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_interval"(interval, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_macaddr"("macaddr", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_macaddr"("macaddr", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_macaddr"("macaddr", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_macaddr"("macaddr", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_macaddr8"("macaddr8", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_macaddr8"("macaddr8", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_macaddr8"("macaddr8", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_macaddr8"("macaddr8", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_money"("money", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_money"("money", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_money"("money", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_money"("money", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_name"("name", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_name"("name", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_name"("name", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_name"("name", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_numeric"(numeric, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_numeric"(numeric, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_numeric"(numeric, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_numeric"(numeric, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_oid"("oid", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_oid"("oid", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_oid"("oid", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_oid"("oid", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_text"("text", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_text"("text", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_text"("text", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_text"("text", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_time"(time without time zone, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_time"(time without time zone, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_time"(time without time zone, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_time"(time without time zone, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_timestamp"(timestamp without time zone, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_timestamp"(timestamp without time zone, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_timestamp"(timestamp without time zone, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_timestamp"(timestamp without time zone, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_timestamptz"(timestamp with time zone, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_timestamptz"(timestamp with time zone, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_timestamptz"(timestamp with time zone, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_timestamptz"(timestamp with time zone, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_timetz"(time with time zone, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_timetz"(time with time zone, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_timetz"(time with time zone, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_timetz"(time with time zone, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_uuid"("uuid", "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_uuid"("uuid", "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_uuid"("uuid", "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_uuid"("uuid", "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_varbit"(bit varying, "internal", smallint, "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_varbit"(bit varying, "internal", smallint, "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_varbit"(bit varying, "internal", smallint, "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_varbit"(bit varying, "internal", smallint, "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_anyenum"("anyenum", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_anyenum"("anyenum", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_anyenum"("anyenum", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_anyenum"("anyenum", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_bit"(bit, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_bit"(bit, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_bit"(bit, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_bit"(bit, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_bool"(boolean, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_bool"(boolean, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_bool"(boolean, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_bool"(boolean, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_bpchar"(character, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_bpchar"(character, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_bpchar"(character, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_bpchar"(character, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_bytea"("bytea", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_bytea"("bytea", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_bytea"("bytea", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_bytea"("bytea", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_char"("char", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_char"("char", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_char"("char", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_char"("char", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_cidr"("cidr", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_cidr"("cidr", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_cidr"("cidr", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_cidr"("cidr", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_date"("date", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_date"("date", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_date"("date", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_date"("date", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_float4"(real, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_float4"(real, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_float4"(real, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_float4"(real, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_float8"(double precision, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_float8"(double precision, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_float8"(double precision, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_float8"(double precision, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_inet"("inet", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_inet"("inet", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_inet"("inet", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_inet"("inet", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_int2"(smallint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_int2"(smallint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_int2"(smallint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_int2"(smallint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_int4"(integer, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_int4"(integer, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_int4"(integer, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_int4"(integer, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_int8"(bigint, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_int8"(bigint, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_int8"(bigint, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_int8"(bigint, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_interval"(interval, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_interval"(interval, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_interval"(interval, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_interval"(interval, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_macaddr"("macaddr", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_macaddr"("macaddr", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_macaddr"("macaddr", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_macaddr"("macaddr", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_macaddr8"("macaddr8", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_macaddr8"("macaddr8", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_macaddr8"("macaddr8", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_macaddr8"("macaddr8", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_money"("money", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_money"("money", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_money"("money", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_money"("money", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_name"("name", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_name"("name", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_name"("name", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_name"("name", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_numeric"(numeric, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_numeric"(numeric, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_numeric"(numeric, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_numeric"(numeric, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_oid"("oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_oid"("oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_oid"("oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_oid"("oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_text"("text", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_text"("text", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_text"("text", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_text"("text", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_time"(time without time zone, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_time"(time without time zone, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_time"(time without time zone, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_time"(time without time zone, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_timestamp"(timestamp without time zone, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_timestamp"(timestamp without time zone, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_timestamp"(timestamp without time zone, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_timestamp"(timestamp without time zone, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_timestamptz"(timestamp with time zone, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_timestamptz"(timestamp with time zone, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_timestamptz"(timestamp with time zone, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_timestamptz"(timestamp with time zone, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_timetz"(time with time zone, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_timetz"(time with time zone, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_timetz"(time with time zone, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_timetz"(time with time zone, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_uuid"("uuid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_uuid"("uuid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_uuid"("uuid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_uuid"("uuid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_varbit"(bit varying, "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_varbit"(bit varying, "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_varbit"(bit varying, "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_varbit"(bit varying, "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_numeric_cmp"(numeric, numeric) TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_numeric_cmp"(numeric, numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."gin_numeric_cmp"(numeric, numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_numeric_cmp"(numeric, numeric) TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_accum"(double precision[], "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_accum"(double precision[], "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_accum"(double precision[], "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_accum"(double precision[], "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_add"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_add"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_add"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_add"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_avg"(double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_avg"(double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_avg"(double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_avg"(double precision[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_cmp"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_cmp"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_cmp"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_cmp"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_combine"(double precision[], double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_combine"(double precision[], double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_combine"(double precision[], double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_combine"(double precision[], double precision[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_concat"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_concat"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_concat"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_concat"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_eq"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_eq"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_eq"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_eq"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_ge"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_ge"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_ge"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_ge"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_gt"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_gt"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_gt"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_gt"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_l2_squared_distance"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_l2_squared_distance"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_l2_squared_distance"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_l2_squared_distance"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_le"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_le"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_le"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_le"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_lt"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_lt"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_lt"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_lt"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_mul"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_mul"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_mul"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_mul"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_ne"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_ne"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_ne"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_ne"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_negative_inner_product"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_negative_inner_product"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_negative_inner_product"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_negative_inner_product"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_spherical_distance"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_spherical_distance"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_spherical_distance"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_spherical_distance"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_sub"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_sub"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_sub"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_sub"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."hamming_distance"(bit, bit) TO "postgres";
GRANT ALL ON FUNCTION "public"."hamming_distance"(bit, bit) TO "anon";
GRANT ALL ON FUNCTION "public"."hamming_distance"(bit, bit) TO "authenticated";
GRANT ALL ON FUNCTION "public"."hamming_distance"(bit, bit) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."hash_ltree"("public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."hash_ltree"("public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."hash_ltree"("public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hash_ltree"("public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."hash_ltree_extended"("public"."ltree", bigint) TO "postgres";
GRANT ALL ON FUNCTION "public"."hash_ltree_extended"("public"."ltree", bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."hash_ltree_extended"("public"."ltree", bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."hash_ltree_extended"("public"."ltree", bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."hnsw_bit_support"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."hnsw_bit_support"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."hnsw_bit_support"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hnsw_bit_support"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."hnsw_halfvec_support"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."hnsw_halfvec_support"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."hnsw_halfvec_support"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hnsw_halfvec_support"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."hnsw_sparsevec_support"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."hnsw_sparsevec_support"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."hnsw_sparsevec_support"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hnsw_sparsevec_support"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."hybrid_search"("query_embedding" "public"."vector", "match_count" integer, "filter_project_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."hybrid_search"("query_embedding" "public"."vector", "match_count" integer, "filter_project_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."hybrid_search"("query_embedding" "public"."vector", "match_count" integer, "filter_project_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."hybrid_search"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer, "text_weight" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."hybrid_search"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer, "text_weight" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."hybrid_search"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer, "text_weight" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."hybrid_search_fm_global"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer, "text_weight" double precision, "filter_asrs_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."hybrid_search_fm_global"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer, "text_weight" double precision, "filter_asrs_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hybrid_search_fm_global"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer, "text_weight" double precision, "filter_asrs_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_session_tokens"("session_id" "uuid", "tokens_to_add" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."increment_session_tokens"("session_id" "uuid", "tokens_to_add" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_session_tokens"("session_id" "uuid", "tokens_to_add" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."index"("public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."index"("public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."index"("public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."index"("public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."index"("public"."ltree", "public"."ltree", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."index"("public"."ltree", "public"."ltree", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."index"("public"."ltree", "public"."ltree", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."index"("public"."ltree", "public"."ltree", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."inner_product"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."inner_product"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."interpolate_sprinkler_requirements"("p_table_id" character varying, "p_target_height_ft" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."interpolate_sprinkler_requirements"("p_table_id" character varying, "p_target_height_ft" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."interpolate_sprinkler_requirements"("p_table_id" character varying, "p_target_height_ft" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."ivfflat_bit_support"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ivfflat_bit_support"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ivfflat_bit_support"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ivfflat_bit_support"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ivfflat_halfvec_support"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ivfflat_halfvec_support"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ivfflat_halfvec_support"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ivfflat_halfvec_support"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."jaccard_distance"(bit, bit) TO "postgres";
GRANT ALL ON FUNCTION "public"."jaccard_distance"(bit, bit) TO "anon";
GRANT ALL ON FUNCTION "public"."jaccard_distance"(bit, bit) TO "authenticated";
GRANT ALL ON FUNCTION "public"."jaccard_distance"(bit, bit) TO "service_role";



GRANT ALL ON FUNCTION "public"."l1_distance"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l1_distance"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_distance"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_distance"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_norm"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_norm"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_norm"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_norm"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_norm"("public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_norm"("public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_norm"("public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_norm"("public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."lca"("public"."ltree"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lca"("public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."lt_q_regex"("public"."ltree", "public"."lquery"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."lt_q_regex"("public"."ltree", "public"."lquery"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."lt_q_regex"("public"."ltree", "public"."lquery"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."lt_q_regex"("public"."ltree", "public"."lquery"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."lt_q_rregex"("public"."lquery"[], "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."lt_q_rregex"("public"."lquery"[], "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."lt_q_rregex"("public"."lquery"[], "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lt_q_rregex"("public"."lquery"[], "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltq_regex"("public"."ltree", "public"."lquery") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltq_regex"("public"."ltree", "public"."lquery") TO "anon";
GRANT ALL ON FUNCTION "public"."ltq_regex"("public"."ltree", "public"."lquery") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltq_regex"("public"."ltree", "public"."lquery") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltq_rregex"("public"."lquery", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltq_rregex"("public"."lquery", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltq_rregex"("public"."lquery", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltq_rregex"("public"."lquery", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree2text"("public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree2text"("public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree2text"("public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree2text"("public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_addltree"("public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_addltree"("public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_addltree"("public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_addltree"("public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_addtext"("public"."ltree", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_addtext"("public"."ltree", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_addtext"("public"."ltree", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_addtext"("public"."ltree", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_cmp"("public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_cmp"("public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_cmp"("public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_cmp"("public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_compress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_consistent"("internal", "public"."ltree", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_consistent"("internal", "public"."ltree", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_consistent"("internal", "public"."ltree", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_consistent"("internal", "public"."ltree", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_decompress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_decompress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_decompress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_decompress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_eq"("public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_eq"("public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_eq"("public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_eq"("public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_ge"("public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_ge"("public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_ge"("public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_ge"("public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_gist_options"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_gist_options"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_gist_options"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_gist_options"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_gt"("public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_gt"("public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_gt"("public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_gt"("public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_isparent"("public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_isparent"("public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_isparent"("public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_isparent"("public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_le"("public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_le"("public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_le"("public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_le"("public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_lt"("public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_lt"("public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_lt"("public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_lt"("public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_ne"("public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_ne"("public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_ne"("public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_ne"("public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_penalty"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_picksplit"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_risparent"("public"."ltree", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_risparent"("public"."ltree", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_risparent"("public"."ltree", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_risparent"("public"."ltree", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_same"("public"."ltree_gist", "public"."ltree_gist", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_same"("public"."ltree_gist", "public"."ltree_gist", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_same"("public"."ltree_gist", "public"."ltree_gist", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_same"("public"."ltree_gist", "public"."ltree_gist", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_textadd"("text", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_textadd"("text", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_textadd"("text", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_textadd"("text", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltree_union"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltree_union"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ltree_union"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltree_union"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltreeparentsel"("internal", "oid", "internal", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."ltreeparentsel"("internal", "oid", "internal", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."ltreeparentsel"("internal", "oid", "internal", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltreeparentsel"("internal", "oid", "internal", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."ltxtq_exec"("public"."ltree", "public"."ltxtquery") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltxtq_exec"("public"."ltree", "public"."ltxtquery") TO "anon";
GRANT ALL ON FUNCTION "public"."ltxtq_exec"("public"."ltree", "public"."ltxtquery") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltxtq_exec"("public"."ltree", "public"."ltxtquery") TO "service_role";



GRANT ALL ON FUNCTION "public"."ltxtq_rexec"("public"."ltxtquery", "public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."ltxtq_rexec"("public"."ltxtquery", "public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."ltxtq_rexec"("public"."ltxtquery", "public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ltxtq_rexec"("public"."ltxtquery", "public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."mark_document_processed"("p_document_id" "text", "p_insights_count" integer, "p_projects_assigned" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."mark_document_processed"("p_document_id" "text", "p_insights_count" integer, "p_projects_assigned" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_document_processed"("p_document_id" "text", "p_insights_count" integer, "p_projects_assigned" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_archon_code_examples"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."match_archon_code_examples"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_archon_code_examples"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."match_archon_crawled_pages"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."match_archon_crawled_pages"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_archon_crawled_pages"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."match_chunks"("query_embedding" "public"."vector", "match_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."match_chunks"("query_embedding" "public"."vector", "match_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_chunks"("query_embedding" "public"."vector", "match_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_code_examples"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."match_code_examples"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_code_examples"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."match_crawled_pages"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."match_crawled_pages"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_crawled_pages"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb", "source_filter" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."match_decisions"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."match_decisions"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_decisions"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_decisions_by_project"("query_embedding" "public"."vector", "filter_project_ids" integer[], "match_count" integer, "match_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."match_decisions_by_project"("query_embedding" "public"."vector", "filter_project_ids" integer[], "match_count" integer, "match_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_decisions_by_project"("query_embedding" "public"."vector", "filter_project_ids" integer[], "match_count" integer, "match_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_document_chunks"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_document_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."match_document_chunks"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_document_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_document_chunks"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_document_ids" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_doc_type" "text", "filter_project_id" bigint, "filter_metadata_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_doc_type" "text", "filter_project_id" bigint, "filter_metadata_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_doc_type" "text", "filter_project_id" bigint, "filter_metadata_ids" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_documents_enhanced"("query_embedding" "public"."vector", "match_count" integer, "category_filter" "text", "year_filter" integer, "project_filter" "text", "date_after_filter" timestamp without time zone, "participants_filter" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."match_documents_enhanced"("query_embedding" "public"."vector", "match_count" integer, "category_filter" "text", "year_filter" integer, "project_filter" "text", "date_after_filter" timestamp without time zone, "participants_filter" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_documents_enhanced"("query_embedding" "public"."vector", "match_count" integer, "category_filter" "text", "year_filter" integer, "project_filter" "text", "date_after_filter" timestamp without time zone, "participants_filter" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."match_documents_full"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."match_documents_full"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_documents_full"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_files"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."match_files"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_files"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."match_fm_documents"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."match_fm_documents"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_fm_documents"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_fm_global_vectors"("query_embedding" "public"."vector", "match_count" integer, "filter_asrs_type" "text", "filter_source_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."match_fm_global_vectors"("query_embedding" "public"."vector", "match_count" integer, "filter_asrs_type" "text", "filter_source_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_fm_global_vectors"("query_embedding" "public"."vector", "match_count" integer, "filter_asrs_type" "text", "filter_source_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."match_fm_tables"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."match_fm_tables"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_fm_tables"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_fm_tables"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."match_fm_tables"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_fm_tables"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_meeting_chunks"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "p_project_id" integer, "p_meeting_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."match_meeting_chunks"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "p_project_id" integer, "p_meeting_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_meeting_chunks"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "p_project_id" integer, "p_meeting_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."match_meeting_chunks_with_project"("query_embedding" "public"."vector", "p_project_id" integer, "match_count" integer, "match_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."match_meeting_chunks_with_project"("query_embedding" "public"."vector", "p_project_id" integer, "match_count" integer, "match_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_meeting_chunks_with_project"("query_embedding" "public"."vector", "p_project_id" integer, "match_count" integer, "match_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_meeting_segments"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."match_meeting_segments"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_meeting_segments"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_meeting_segments_by_project"("query_embedding" "public"."vector", "filter_project_ids" integer[], "match_count" integer, "match_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."match_meeting_segments_by_project"("query_embedding" "public"."vector", "filter_project_ids" integer[], "match_count" integer, "match_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_meeting_segments_by_project"("query_embedding" "public"."vector", "filter_project_ids" integer[], "match_count" integer, "match_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_meetings"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_project_id" bigint, "after_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."match_meetings"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_project_id" bigint, "after_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_meetings"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_project_id" bigint, "after_date" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_memories"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."match_memories"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_memories"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."match_opportunities"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."match_opportunities"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_opportunities"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_page_sections"("embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "min_content_length" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."match_page_sections"("embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "min_content_length" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_page_sections"("embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "min_content_length" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_recent_documents"("query_embedding" "public"."vector", "match_count" integer, "days_back" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."match_recent_documents"("query_embedding" "public"."vector", "match_count" integer, "days_back" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_recent_documents"("query_embedding" "public"."vector", "match_count" integer, "days_back" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_risks"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."match_risks"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_risks"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_risks_by_project"("query_embedding" "public"."vector", "filter_project_ids" bigint[], "match_count" integer, "match_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."match_risks_by_project"("query_embedding" "public"."vector", "filter_project_ids" bigint[], "match_count" integer, "match_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_risks_by_project"("query_embedding" "public"."vector", "filter_project_ids" bigint[], "match_count" integer, "match_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_segments"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_metadata_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."match_segments"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_metadata_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_segments"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_metadata_ids" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_tasks"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_project_id" bigint, "filter_status" "text", "filter_assignee" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."match_tasks"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_project_id" bigint, "filter_status" "text", "filter_assignee" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_tasks"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision, "filter_project_id" bigint, "filter_status" "text", "filter_assignee" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."nlevel"("public"."ltree") TO "postgres";
GRANT ALL ON FUNCTION "public"."nlevel"("public"."ltree") TO "anon";
GRANT ALL ON FUNCTION "public"."nlevel"("public"."ltree") TO "authenticated";
GRANT ALL ON FUNCTION "public"."nlevel"("public"."ltree") TO "service_role";



GRANT ALL ON FUNCTION "public"."normalize_exact_quotes"("in_json" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."normalize_exact_quotes"("in_json" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."normalize_exact_quotes"("in_json" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."populate_insight_names"() TO "anon";
GRANT ALL ON FUNCTION "public"."populate_insight_names"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."populate_insight_names"() TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_budget_rollup"("p_project_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_budget_rollup"("p_project_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_budget_rollup"("p_project_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_contract_financial_summary"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_contract_financial_summary"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_contract_financial_summary"() TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_contract_financial_summary_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_contract_financial_summary_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_contract_financial_summary_trigger"() TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_search_vectors"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_search_vectors"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_search_vectors"() TO "service_role";



GRANT ALL ON FUNCTION "public"."search_all_knowledge"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."search_all_knowledge"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_all_knowledge"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_asrs_figures"("p_search_text" "text", "p_asrs_type" character varying, "p_container_type" character varying, "p_orientation_type" character varying, "p_rack_depth" character varying, "p_spacing" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."search_asrs_figures"("p_search_text" "text", "p_asrs_type" character varying, "p_container_type" character varying, "p_orientation_type" character varying, "p_rack_depth" character varying, "p_spacing" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_asrs_figures"("p_search_text" "text", "p_asrs_type" character varying, "p_container_type" character varying, "p_orientation_type" character varying, "p_rack_depth" character varying, "p_spacing" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_by_category"("query_embedding" "public"."vector", "category" "text", "match_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_by_category"("query_embedding" "public"."vector", "category" "text", "match_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_by_category"("query_embedding" "public"."vector", "category" "text", "match_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_by_participants"("query_embedding" "public"."vector", "participant_name" "text", "match_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_by_participants"("query_embedding" "public"."vector", "participant_name" "text", "match_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_by_participants"("query_embedding" "public"."vector", "participant_name" "text", "match_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_documentation"("query_text" "text", "section_filter" "text", "limit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_documentation"("query_text" "text", "section_filter" "text", "limit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_documentation"("query_text" "text", "section_filter" "text", "limit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_fm_global_all"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_fm_global_all"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_fm_global_all"("query_embedding" "public"."vector", "query_text" "text", "match_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_meeting_chunks"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "project_filter" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."search_meeting_chunks"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "project_filter" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_meeting_chunks"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "project_filter" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_meeting_chunks"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "project_filter" bigint, "date_from" timestamp with time zone, "date_to" timestamp with time zone, "chunk_types" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."search_meeting_chunks"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "project_filter" bigint, "date_from" timestamp with time zone, "date_to" timestamp with time zone, "chunk_types" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_meeting_chunks"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "project_filter" bigint, "date_from" timestamp with time zone, "date_to" timestamp with time zone, "chunk_types" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_meeting_chunks_semantic"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_meeting_id" "uuid", "filter_project_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."search_meeting_chunks_semantic"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_meeting_id" "uuid", "filter_project_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_meeting_chunks_semantic"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_meeting_id" "uuid", "filter_project_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_meeting_embeddings"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "project_filter" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_meeting_embeddings"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "project_filter" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_meeting_embeddings"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "project_filter" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_text_chunks"("search_query" "text", "embedding_vector" "public"."vector", "page_filter" integer, "compliance_filter" "text", "cost_impact_filter" "text", "match_threshold" double precision, "max_results" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_text_chunks"("search_query" "text", "embedding_vector" "public"."vector", "page_filter" integer, "compliance_filter" "text", "cost_impact_filter" "text", "match_threshold" double precision, "max_results" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_text_chunks"("search_query" "text", "embedding_vector" "public"."vector", "page_filter" integer, "compliance_filter" "text", "cost_impact_filter" "text", "match_threshold" double precision, "max_results" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_chunk_doc_title"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_chunk_doc_title"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_chunk_doc_title"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_default_severity"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_default_severity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_default_severity"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_document_insight_doc_title"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_document_insight_doc_title"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_document_insight_doc_title"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "postgres";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "anon";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_project_id_by_title"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_project_id_by_title"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_project_id_by_title"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_project_id_from_title"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_project_id_from_title"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_project_id_from_title"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_supervisor_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_supervisor_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_supervisor_name"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."show_limit"() TO "postgres";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "anon";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_cmp"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_cmp"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_cmp"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_cmp"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_eq"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_eq"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_eq"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_eq"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_ge"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_ge"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_ge"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_ge"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_gt"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_gt"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_gt"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_gt"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_l2_squared_distance"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_l2_squared_distance"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_l2_squared_distance"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_l2_squared_distance"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_le"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_le"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_le"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_le"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_lt"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_lt"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_lt"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_lt"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_ne"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_ne"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_ne"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_ne"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_negative_inner_product"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_negative_inner_product"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_negative_inner_product"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_negative_inner_product"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."subltree"("public"."ltree", integer, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."subltree"("public"."ltree", integer, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."subltree"("public"."ltree", integer, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."subltree"("public"."ltree", integer, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."subpath"("public"."ltree", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."subpath"("public"."ltree", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."subpath"("public"."ltree", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."subpath"("public"."ltree", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."subpath"("public"."ltree", integer, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."subpath"("public"."ltree", integer, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."subpath"("public"."ltree", integer, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."subpath"("public"."ltree", integer, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."subvector"("public"."halfvec", integer, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."subvector"("public"."halfvec", integer, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."subvector"("public"."halfvec", integer, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."subvector"("public"."halfvec", integer, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."subvector"("public"."vector", integer, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."subvector"("public"."vector", integer, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."subvector"("public"."vector", integer, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."subvector"("public"."vector", integer, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."suggest_project_assignments"("p_document_content" "text", "p_document_title" "text", "p_participants" "text", "p_top_matches" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."suggest_project_assignments"("p_document_content" "text", "p_document_title" "text", "p_participants" "text", "p_top_matches" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."suggest_project_assignments"("p_document_content" "text", "p_document_title" "text", "p_participants" "text", "p_top_matches" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_ai_insights_meeting_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_ai_insights_meeting_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_ai_insights_meeting_name"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_client"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_client"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_client"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_contacts_company_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_contacts_company_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_contacts_company_name"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_cost_codes_division_title"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_cost_codes_division_title"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_cost_codes_division_title"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_doc_title"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_doc_title"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_doc_title"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_document_insights_project"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_document_insights_project"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_document_insights_project"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_document_metadata_on_project_name_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_document_metadata_on_project_name_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_document_metadata_on_project_name_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_document_metadata_project_from_project_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_document_metadata_project_from_project_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_document_metadata_project_from_project_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_document_project_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_document_project_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_document_project_name"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_insight_project_from_document"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_insight_project_from_document"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_insight_project_from_document"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_meeting_title"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_meeting_title"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_meeting_title"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_project"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_project"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_project"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_project_title"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_project_title"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_project_title"() TO "service_role";



GRANT ALL ON FUNCTION "public"."text2ltree"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."text2ltree"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."text2ltree"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."text2ltree"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."text_search_chunks"("search_query" "text", "match_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."text_search_chunks"("search_query" "text", "match_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."text_search_chunks"("search_query" "text", "match_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."track_submittal_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."track_submittal_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."track_submittal_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_app_users_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_app_users_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_app_users_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_chat_last_message_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_chat_last_message_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_chat_last_message_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_document_project_assignment"("p_document_id" "text", "p_project_id" bigint, "p_confidence" numeric, "p_reasoning" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_document_project_assignment"("p_document_id" "text", "p_project_id" bigint, "p_confidence" numeric, "p_reasoning" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_document_project_assignment"("p_document_id" "text", "p_project_id" bigint, "p_confidence" numeric, "p_reasoning" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_initiatives_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_initiatives_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_initiatives_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_insight_names"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_insight_names"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_insight_names"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_meeting_chunks_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_meeting_chunks_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_meeting_chunks_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_rag_pipeline_state_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_rag_pipeline_state_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_rag_pipeline_state_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_search_vector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_search_vector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_search_vector"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_project_assignment"("p_document_id" "text", "p_project_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."validate_project_assignment"("p_document_id" "text", "p_project_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_project_assignment"("p_document_id" "text", "p_project_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_concat"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_concat"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_concat"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_concat"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_dims"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_search"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_search"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_search"("query_embedding" "public"."vector", "match_count" integer, "match_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "service_role";












GRANT ALL ON FUNCTION "public"."avg"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."avg"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."avg"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."avg"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."sum"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sum"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."sum"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sum"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "service_role";


















GRANT ALL ON TABLE "next_auth"."accounts" TO "service_role";



GRANT ALL ON TABLE "next_auth"."sessions" TO "service_role";



GRANT ALL ON TABLE "next_auth"."users" TO "service_role";



GRANT ALL ON TABLE "next_auth"."verification_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."Prospects" TO "anon";
GRANT ALL ON TABLE "public"."Prospects" TO "authenticated";
GRANT ALL ON TABLE "public"."Prospects" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Prospects_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Prospects_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Prospects_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."Prospects_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."__drizzle_migrations" TO "anon";
GRANT ALL ON TABLE "public"."__drizzle_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."__drizzle_migrations" TO "service_role";



GRANT ALL ON TABLE "public"."document_insights" TO "anon";
GRANT ALL ON TABLE "public"."document_insights" TO "authenticated";
GRANT ALL ON TABLE "public"."document_insights" TO "service_role";



GRANT ALL ON TABLE "public"."document_metadata" TO "anon";
GRANT ALL ON TABLE "public"."document_metadata" TO "authenticated";
GRANT ALL ON TABLE "public"."document_metadata" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."document_metadata" TO "zapier";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."actionable_insights" TO "anon";
GRANT ALL ON TABLE "public"."actionable_insights" TO "authenticated";
GRANT ALL ON TABLE "public"."actionable_insights" TO "service_role";



GRANT ALL ON TABLE "public"."active_submittals" TO "anon";
GRANT ALL ON TABLE "public"."active_submittals" TO "authenticated";
GRANT ALL ON TABLE "public"."active_submittals" TO "service_role";



GRANT ALL ON TABLE "public"."ai_analysis_jobs" TO "anon";
GRANT ALL ON TABLE "public"."ai_analysis_jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_analysis_jobs" TO "service_role";



GRANT ALL ON TABLE "public"."ai_insights" TO "anon";
GRANT ALL ON TABLE "public"."ai_insights" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_insights" TO "service_role";



GRANT ALL ON SEQUENCE "public"."ai_insights_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ai_insights_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ai_insights_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."ai_insights_id_seq" TO "zapier";



GRANT ALL ON SEQUENCE "public"."ai_insights_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."ai_insights_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ai_insights_id_seq1" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."ai_insights_id_seq1" TO "zapier";



GRANT ALL ON TABLE "public"."ai_insights_today" TO "anon";
GRANT ALL ON TABLE "public"."ai_insights_today" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_insights_today" TO "service_role";



GRANT ALL ON TABLE "public"."ai_insights_with_project" TO "anon";
GRANT ALL ON TABLE "public"."ai_insights_with_project" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_insights_with_project" TO "service_role";



GRANT ALL ON TABLE "public"."ai_models" TO "anon";
GRANT ALL ON TABLE "public"."ai_models" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_models" TO "service_role";



GRANT ALL ON TABLE "public"."ai_tasks" TO "anon";
GRANT ALL ON TABLE "public"."ai_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_tasks" TO "service_role";



GRANT ALL ON TABLE "public"."app_users" TO "anon";
GRANT ALL ON TABLE "public"."app_users" TO "authenticated";
GRANT ALL ON TABLE "public"."app_users" TO "service_role";



GRANT ALL ON TABLE "public"."archon_code_examples" TO "anon";
GRANT ALL ON TABLE "public"."archon_code_examples" TO "authenticated";
GRANT ALL ON TABLE "public"."archon_code_examples" TO "service_role";



GRANT ALL ON SEQUENCE "public"."archon_code_examples_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."archon_code_examples_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."archon_code_examples_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."archon_code_examples_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."archon_crawled_pages" TO "anon";
GRANT ALL ON TABLE "public"."archon_crawled_pages" TO "authenticated";
GRANT ALL ON TABLE "public"."archon_crawled_pages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."archon_crawled_pages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."archon_crawled_pages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."archon_crawled_pages_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."archon_crawled_pages_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."archon_document_versions" TO "anon";
GRANT ALL ON TABLE "public"."archon_document_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."archon_document_versions" TO "service_role";



GRANT ALL ON TABLE "public"."archon_project_sources" TO "anon";
GRANT ALL ON TABLE "public"."archon_project_sources" TO "authenticated";
GRANT ALL ON TABLE "public"."archon_project_sources" TO "service_role";



GRANT ALL ON TABLE "public"."archon_projects" TO "anon";
GRANT ALL ON TABLE "public"."archon_projects" TO "authenticated";
GRANT ALL ON TABLE "public"."archon_projects" TO "service_role";



GRANT ALL ON TABLE "public"."archon_prompts" TO "anon";
GRANT ALL ON TABLE "public"."archon_prompts" TO "authenticated";
GRANT ALL ON TABLE "public"."archon_prompts" TO "service_role";



GRANT ALL ON TABLE "public"."archon_settings" TO "anon";
GRANT ALL ON TABLE "public"."archon_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."archon_settings" TO "service_role";



GRANT ALL ON TABLE "public"."archon_sources" TO "anon";
GRANT ALL ON TABLE "public"."archon_sources" TO "authenticated";
GRANT ALL ON TABLE "public"."archon_sources" TO "service_role";



GRANT ALL ON TABLE "public"."archon_tasks" TO "anon";
GRANT ALL ON TABLE "public"."archon_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."archon_tasks" TO "service_role";



GRANT ALL ON TABLE "public"."asrs_blocks" TO "anon";
GRANT ALL ON TABLE "public"."asrs_blocks" TO "authenticated";
GRANT ALL ON TABLE "public"."asrs_blocks" TO "service_role";



GRANT ALL ON TABLE "public"."asrs_configurations" TO "anon";
GRANT ALL ON TABLE "public"."asrs_configurations" TO "authenticated";
GRANT ALL ON TABLE "public"."asrs_configurations" TO "service_role";



GRANT ALL ON TABLE "public"."asrs_decision_matrix" TO "anon";
GRANT ALL ON TABLE "public"."asrs_decision_matrix" TO "authenticated";
GRANT ALL ON TABLE "public"."asrs_decision_matrix" TO "service_role";



GRANT ALL ON TABLE "public"."asrs_logic_cards" TO "anon";
GRANT ALL ON TABLE "public"."asrs_logic_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."asrs_logic_cards" TO "service_role";



GRANT ALL ON SEQUENCE "public"."asrs_logic_cards_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."asrs_logic_cards_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."asrs_logic_cards_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."asrs_logic_cards_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."asrs_protection_rules" TO "anon";
GRANT ALL ON TABLE "public"."asrs_protection_rules" TO "authenticated";
GRANT ALL ON TABLE "public"."asrs_protection_rules" TO "service_role";



GRANT ALL ON TABLE "public"."asrs_sections" TO "anon";
GRANT ALL ON TABLE "public"."asrs_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."asrs_sections" TO "service_role";



GRANT ALL ON TABLE "public"."attachments" TO "anon";
GRANT ALL ON TABLE "public"."attachments" TO "authenticated";
GRANT ALL ON TABLE "public"."attachments" TO "service_role";



GRANT ALL ON TABLE "public"."billing_periods" TO "anon";
GRANT ALL ON TABLE "public"."billing_periods" TO "authenticated";
GRANT ALL ON TABLE "public"."billing_periods" TO "service_role";



GRANT ALL ON TABLE "public"."block_embeddings" TO "anon";
GRANT ALL ON TABLE "public"."block_embeddings" TO "authenticated";
GRANT ALL ON TABLE "public"."block_embeddings" TO "service_role";



GRANT ALL ON TABLE "public"."briefing_runs" TO "anon";
GRANT ALL ON TABLE "public"."briefing_runs" TO "authenticated";
GRANT ALL ON TABLE "public"."briefing_runs" TO "service_role";



GRANT ALL ON TABLE "public"."budget_codes" TO "anon";
GRANT ALL ON TABLE "public"."budget_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."budget_codes" TO "service_role";



GRANT ALL ON TABLE "public"."budget_items" TO "anon";
GRANT ALL ON TABLE "public"."budget_items" TO "authenticated";
GRANT ALL ON TABLE "public"."budget_items" TO "service_role";



GRANT ALL ON TABLE "public"."budget_line_items" TO "anon";
GRANT ALL ON TABLE "public"."budget_line_items" TO "authenticated";
GRANT ALL ON TABLE "public"."budget_line_items" TO "service_role";



GRANT ALL ON TABLE "public"."budget_modifications" TO "anon";
GRANT ALL ON TABLE "public"."budget_modifications" TO "authenticated";
GRANT ALL ON TABLE "public"."budget_modifications" TO "service_role";



GRANT ALL ON TABLE "public"."budget_snapshots" TO "anon";
GRANT ALL ON TABLE "public"."budget_snapshots" TO "authenticated";
GRANT ALL ON TABLE "public"."budget_snapshots" TO "service_role";



GRANT ALL ON TABLE "public"."change_event_line_items" TO "anon";
GRANT ALL ON TABLE "public"."change_event_line_items" TO "authenticated";
GRANT ALL ON TABLE "public"."change_event_line_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."change_event_line_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."change_event_line_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."change_event_line_items_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."change_events" TO "anon";
GRANT ALL ON TABLE "public"."change_events" TO "authenticated";
GRANT ALL ON TABLE "public"."change_events" TO "service_role";



GRANT ALL ON SEQUENCE "public"."change_events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."change_events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."change_events_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."change_order_approvals" TO "anon";
GRANT ALL ON TABLE "public"."change_order_approvals" TO "authenticated";
GRANT ALL ON TABLE "public"."change_order_approvals" TO "service_role";



GRANT ALL ON SEQUENCE "public"."change_order_approvals_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."change_order_approvals_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."change_order_approvals_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."change_order_costs" TO "anon";
GRANT ALL ON TABLE "public"."change_order_costs" TO "authenticated";
GRANT ALL ON TABLE "public"."change_order_costs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."change_order_costs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."change_order_costs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."change_order_costs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."change_order_line_items" TO "anon";
GRANT ALL ON TABLE "public"."change_order_line_items" TO "authenticated";
GRANT ALL ON TABLE "public"."change_order_line_items" TO "service_role";



GRANT ALL ON TABLE "public"."change_order_lines" TO "anon";
GRANT ALL ON TABLE "public"."change_order_lines" TO "authenticated";
GRANT ALL ON TABLE "public"."change_order_lines" TO "service_role";



GRANT ALL ON SEQUENCE "public"."change_order_lines_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."change_order_lines_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."change_order_lines_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."change_orders" TO "anon";
GRANT ALL ON TABLE "public"."change_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."change_orders" TO "service_role";



GRANT ALL ON SEQUENCE "public"."change_orders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."change_orders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."change_orders_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."chat_history" TO "anon";
GRANT ALL ON TABLE "public"."chat_history" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_history" TO "service_role";



GRANT ALL ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";



GRANT ALL ON TABLE "public"."chat_sessions" TO "anon";
GRANT ALL ON TABLE "public"."chat_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."chat_thread_attachment_files" TO "anon";
GRANT ALL ON TABLE "public"."chat_thread_attachment_files" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_thread_attachment_files" TO "service_role";



GRANT ALL ON TABLE "public"."chat_thread_attachments" TO "anon";
GRANT ALL ON TABLE "public"."chat_thread_attachments" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_thread_attachments" TO "service_role";



GRANT ALL ON TABLE "public"."chat_thread_feedback" TO "anon";
GRANT ALL ON TABLE "public"."chat_thread_feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_thread_feedback" TO "service_role";



GRANT ALL ON TABLE "public"."chat_thread_items" TO "anon";
GRANT ALL ON TABLE "public"."chat_thread_items" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_thread_items" TO "service_role";



GRANT ALL ON TABLE "public"."chat_threads" TO "anon";
GRANT ALL ON TABLE "public"."chat_threads" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_threads" TO "service_role";



GRANT ALL ON TABLE "public"."chats" TO "anon";
GRANT ALL ON TABLE "public"."chats" TO "authenticated";
GRANT ALL ON TABLE "public"."chats" TO "service_role";



GRANT ALL ON TABLE "public"."chunks" TO "anon";
GRANT ALL ON TABLE "public"."chunks" TO "authenticated";
GRANT ALL ON TABLE "public"."chunks" TO "service_role";



GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";



GRANT ALL ON SEQUENCE "public"."clients_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."clients_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."clients_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."clients_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."code_examples" TO "anon";
GRANT ALL ON TABLE "public"."code_examples" TO "authenticated";
GRANT ALL ON TABLE "public"."code_examples" TO "service_role";



GRANT ALL ON SEQUENCE "public"."code_examples_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."code_examples_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."code_examples_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."commitment_changes" TO "anon";
GRANT ALL ON TABLE "public"."commitment_changes" TO "authenticated";
GRANT ALL ON TABLE "public"."commitment_changes" TO "service_role";



GRANT ALL ON TABLE "public"."commitments" TO "anon";
GRANT ALL ON TABLE "public"."commitments" TO "authenticated";
GRANT ALL ON TABLE "public"."commitments" TO "service_role";



GRANT ALL ON TABLE "public"."companies" TO "anon";
GRANT ALL ON TABLE "public"."companies" TO "authenticated";
GRANT ALL ON TABLE "public"."companies" TO "service_role";



GRANT ALL ON TABLE "public"."company_context" TO "anon";
GRANT ALL ON TABLE "public"."company_context" TO "authenticated";
GRANT ALL ON TABLE "public"."company_context" TO "service_role";



GRANT ALL ON TABLE "public"."contacts" TO "anon";
GRANT ALL ON TABLE "public"."contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."contacts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."contacts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contacts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contacts_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."contacts_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."contracts" TO "anon";
GRANT ALL ON TABLE "public"."contracts" TO "authenticated";
GRANT ALL ON TABLE "public"."contracts" TO "service_role";



GRANT ALL ON TABLE "public"."owner_invoice_line_items" TO "anon";
GRANT ALL ON TABLE "public"."owner_invoice_line_items" TO "authenticated";
GRANT ALL ON TABLE "public"."owner_invoice_line_items" TO "service_role";



GRANT ALL ON TABLE "public"."owner_invoices" TO "anon";
GRANT ALL ON TABLE "public"."owner_invoices" TO "authenticated";
GRANT ALL ON TABLE "public"."owner_invoices" TO "service_role";



GRANT ALL ON TABLE "public"."payment_transactions" TO "anon";
GRANT ALL ON TABLE "public"."payment_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."pcco_line_items" TO "anon";
GRANT ALL ON TABLE "public"."pcco_line_items" TO "authenticated";
GRANT ALL ON TABLE "public"."pcco_line_items" TO "service_role";



GRANT ALL ON TABLE "public"."pco_line_items" TO "anon";
GRANT ALL ON TABLE "public"."pco_line_items" TO "authenticated";
GRANT ALL ON TABLE "public"."pco_line_items" TO "service_role";



GRANT ALL ON TABLE "public"."prime_contract_change_orders" TO "anon";
GRANT ALL ON TABLE "public"."prime_contract_change_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."prime_contract_change_orders" TO "service_role";



GRANT ALL ON TABLE "public"."prime_contract_sovs" TO "anon";
GRANT ALL ON TABLE "public"."prime_contract_sovs" TO "authenticated";
GRANT ALL ON TABLE "public"."prime_contract_sovs" TO "service_role";



GRANT ALL ON TABLE "public"."prime_potential_change_orders" TO "anon";
GRANT ALL ON TABLE "public"."prime_potential_change_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."prime_potential_change_orders" TO "service_role";



GRANT ALL ON TABLE "public"."contract_financial_summary" TO "anon";
GRANT ALL ON TABLE "public"."contract_financial_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."contract_financial_summary" TO "service_role";



GRANT ALL ON TABLE "public"."contract_financial_summary_mv" TO "anon";
GRANT ALL ON TABLE "public"."contract_financial_summary_mv" TO "authenticated";
GRANT ALL ON TABLE "public"."contract_financial_summary_mv" TO "service_role";



GRANT ALL ON SEQUENCE "public"."contracts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contracts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contracts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."conversations" TO "anon";
GRANT ALL ON TABLE "public"."conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."conversations" TO "service_role";



GRANT ALL ON TABLE "public"."issues" TO "anon";
GRANT ALL ON TABLE "public"."issues" TO "authenticated";
GRANT ALL ON TABLE "public"."issues" TO "service_role";



GRANT ALL ON TABLE "public"."cost_by_category" TO "anon";
GRANT ALL ON TABLE "public"."cost_by_category" TO "authenticated";
GRANT ALL ON TABLE "public"."cost_by_category" TO "service_role";



GRANT ALL ON TABLE "public"."cost_code_division_updates_audit" TO "anon";
GRANT ALL ON TABLE "public"."cost_code_division_updates_audit" TO "authenticated";
GRANT ALL ON TABLE "public"."cost_code_division_updates_audit" TO "service_role";



GRANT ALL ON TABLE "public"."cost_code_divisions" TO "anon";
GRANT ALL ON TABLE "public"."cost_code_divisions" TO "authenticated";
GRANT ALL ON TABLE "public"."cost_code_divisions" TO "service_role";



GRANT ALL ON TABLE "public"."cost_code_types" TO "anon";
GRANT ALL ON TABLE "public"."cost_code_types" TO "authenticated";
GRANT ALL ON TABLE "public"."cost_code_types" TO "service_role";



GRANT ALL ON TABLE "public"."cost_codes" TO "anon";
GRANT ALL ON TABLE "public"."cost_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."cost_codes" TO "service_role";



GRANT ALL ON TABLE "public"."cost_factors" TO "anon";
GRANT ALL ON TABLE "public"."cost_factors" TO "authenticated";
GRANT ALL ON TABLE "public"."cost_factors" TO "service_role";



GRANT ALL ON TABLE "public"."cost_forecasts" TO "anon";
GRANT ALL ON TABLE "public"."cost_forecasts" TO "authenticated";
GRANT ALL ON TABLE "public"."cost_forecasts" TO "service_role";



GRANT ALL ON TABLE "public"."crawled_pages" TO "anon";
GRANT ALL ON TABLE "public"."crawled_pages" TO "authenticated";
GRANT ALL ON TABLE "public"."crawled_pages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."crawled_pages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."crawled_pages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."crawled_pages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."daily_log_equipment" TO "anon";
GRANT ALL ON TABLE "public"."daily_log_equipment" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_log_equipment" TO "service_role";



GRANT ALL ON TABLE "public"."daily_log_manpower" TO "anon";
GRANT ALL ON TABLE "public"."daily_log_manpower" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_log_manpower" TO "service_role";



GRANT ALL ON TABLE "public"."daily_log_notes" TO "anon";
GRANT ALL ON TABLE "public"."daily_log_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_log_notes" TO "service_role";



GRANT ALL ON TABLE "public"."daily_logs" TO "anon";
GRANT ALL ON TABLE "public"."daily_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_logs" TO "service_role";



GRANT ALL ON TABLE "public"."daily_recaps" TO "anon";
GRANT ALL ON TABLE "public"."daily_recaps" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_recaps" TO "service_role";



GRANT ALL ON TABLE "public"."decisions" TO "anon";
GRANT ALL ON TABLE "public"."decisions" TO "authenticated";
GRANT ALL ON TABLE "public"."decisions" TO "service_role";



GRANT ALL ON TABLE "public"."design_recommendations" TO "anon";
GRANT ALL ON TABLE "public"."design_recommendations" TO "authenticated";
GRANT ALL ON TABLE "public"."design_recommendations" TO "service_role";



GRANT ALL ON TABLE "public"."direct_cost_line_items" TO "anon";
GRANT ALL ON TABLE "public"."direct_cost_line_items" TO "authenticated";
GRANT ALL ON TABLE "public"."direct_cost_line_items" TO "service_role";



GRANT ALL ON TABLE "public"."direct_costs" TO "anon";
GRANT ALL ON TABLE "public"."direct_costs" TO "authenticated";
GRANT ALL ON TABLE "public"."direct_costs" TO "service_role";



GRANT ALL ON TABLE "public"."discrepancies" TO "anon";
GRANT ALL ON TABLE "public"."discrepancies" TO "authenticated";
GRANT ALL ON TABLE "public"."discrepancies" TO "service_role";



GRANT ALL ON TABLE "public"."document_chunks" TO "anon";
GRANT ALL ON TABLE "public"."document_chunks" TO "authenticated";
GRANT ALL ON TABLE "public"."document_chunks" TO "service_role";



GRANT ALL ON TABLE "public"."document_executive_summaries" TO "anon";
GRANT ALL ON TABLE "public"."document_executive_summaries" TO "authenticated";
GRANT ALL ON TABLE "public"."document_executive_summaries" TO "service_role";



GRANT ALL ON SEQUENCE "public"."document_executive_summaries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."document_executive_summaries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."document_executive_summaries_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."document_executive_summaries_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."document_group_access" TO "anon";
GRANT ALL ON TABLE "public"."document_group_access" TO "authenticated";
GRANT ALL ON TABLE "public"."document_group_access" TO "service_role";



GRANT ALL ON TABLE "public"."document_metadata_manual_only" TO "anon";
GRANT ALL ON TABLE "public"."document_metadata_manual_only" TO "authenticated";
GRANT ALL ON TABLE "public"."document_metadata_manual_only" TO "service_role";



GRANT ALL ON TABLE "public"."document_metadata_view_no_summary" TO "anon";
GRANT ALL ON TABLE "public"."document_metadata_view_no_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."document_metadata_view_no_summary" TO "service_role";



GRANT ALL ON TABLE "public"."document_rows" TO "anon";
GRANT ALL ON TABLE "public"."document_rows" TO "authenticated";
GRANT ALL ON TABLE "public"."document_rows" TO "service_role";



GRANT ALL ON SEQUENCE "public"."document_rows_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."document_rows_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."document_rows_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."document_rows_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."document_user_access" TO "anon";
GRANT ALL ON TABLE "public"."document_user_access" TO "authenticated";
GRANT ALL ON TABLE "public"."document_user_access" TO "service_role";



GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON TABLE "public"."documents_ordered_view" TO "anon";
GRANT ALL ON TABLE "public"."documents_ordered_view" TO "authenticated";
GRANT ALL ON TABLE "public"."documents_ordered_view" TO "service_role";



GRANT ALL ON TABLE "public"."employees" TO "anon";
GRANT ALL ON TABLE "public"."employees" TO "authenticated";
GRANT ALL ON TABLE "public"."employees" TO "service_role";



GRANT ALL ON SEQUENCE "public"."employees_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."employees_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."employees_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."employees_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."erp_sync_log" TO "anon";
GRANT ALL ON TABLE "public"."erp_sync_log" TO "authenticated";
GRANT ALL ON TABLE "public"."erp_sync_log" TO "service_role";



GRANT ALL ON TABLE "public"."fm_global_figures" TO "anon";
GRANT ALL ON TABLE "public"."fm_global_figures" TO "authenticated";
GRANT ALL ON TABLE "public"."fm_global_figures" TO "service_role";



GRANT ALL ON TABLE "public"."figure_statistics" TO "anon";
GRANT ALL ON TABLE "public"."figure_statistics" TO "authenticated";
GRANT ALL ON TABLE "public"."figure_statistics" TO "service_role";



GRANT ALL ON TABLE "public"."figure_summary" TO "anon";
GRANT ALL ON TABLE "public"."figure_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."figure_summary" TO "service_role";



GRANT ALL ON TABLE "public"."files" TO "anon";
GRANT ALL ON TABLE "public"."files" TO "authenticated";
GRANT ALL ON TABLE "public"."files" TO "service_role";



GRANT ALL ON TABLE "public"."financial_contracts" TO "anon";
GRANT ALL ON TABLE "public"."financial_contracts" TO "authenticated";
GRANT ALL ON TABLE "public"."financial_contracts" TO "service_role";



GRANT ALL ON TABLE "public"."fireflies_ingestion_jobs" TO "anon";
GRANT ALL ON TABLE "public"."fireflies_ingestion_jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."fireflies_ingestion_jobs" TO "service_role";



GRANT ALL ON TABLE "public"."fm_blocks" TO "anon";
GRANT ALL ON TABLE "public"."fm_blocks" TO "authenticated";
GRANT ALL ON TABLE "public"."fm_blocks" TO "service_role";



GRANT ALL ON TABLE "public"."fm_cost_factors" TO "anon";
GRANT ALL ON TABLE "public"."fm_cost_factors" TO "authenticated";
GRANT ALL ON TABLE "public"."fm_cost_factors" TO "service_role";



GRANT ALL ON TABLE "public"."fm_documents" TO "anon";
GRANT ALL ON TABLE "public"."fm_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."fm_documents" TO "service_role";



GRANT ALL ON TABLE "public"."fm_form_submissions" TO "anon";
GRANT ALL ON TABLE "public"."fm_form_submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."fm_form_submissions" TO "service_role";



GRANT ALL ON TABLE "public"."fm_global_tables" TO "anon";
GRANT ALL ON TABLE "public"."fm_global_tables" TO "authenticated";
GRANT ALL ON TABLE "public"."fm_global_tables" TO "service_role";



GRANT ALL ON TABLE "public"."fm_optimization_rules" TO "anon";
GRANT ALL ON TABLE "public"."fm_optimization_rules" TO "authenticated";
GRANT ALL ON TABLE "public"."fm_optimization_rules" TO "service_role";



GRANT ALL ON TABLE "public"."fm_optimization_suggestions" TO "anon";
GRANT ALL ON TABLE "public"."fm_optimization_suggestions" TO "authenticated";
GRANT ALL ON TABLE "public"."fm_optimization_suggestions" TO "service_role";



GRANT ALL ON TABLE "public"."fm_sections" TO "anon";
GRANT ALL ON TABLE "public"."fm_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."fm_sections" TO "service_role";



GRANT ALL ON TABLE "public"."fm_sprinkler_configs" TO "anon";
GRANT ALL ON TABLE "public"."fm_sprinkler_configs" TO "authenticated";
GRANT ALL ON TABLE "public"."fm_sprinkler_configs" TO "service_role";



GRANT ALL ON TABLE "public"."fm_table_vectors" TO "anon";
GRANT ALL ON TABLE "public"."fm_table_vectors" TO "authenticated";
GRANT ALL ON TABLE "public"."fm_table_vectors" TO "service_role";



GRANT ALL ON TABLE "public"."fm_text_chunks" TO "anon";
GRANT ALL ON TABLE "public"."fm_text_chunks" TO "authenticated";
GRANT ALL ON TABLE "public"."fm_text_chunks" TO "service_role";



GRANT ALL ON TABLE "public"."forecasting" TO "anon";
GRANT ALL ON TABLE "public"."forecasting" TO "authenticated";
GRANT ALL ON TABLE "public"."forecasting" TO "service_role";



GRANT ALL ON TABLE "public"."group_members" TO "anon";
GRANT ALL ON TABLE "public"."group_members" TO "authenticated";
GRANT ALL ON TABLE "public"."group_members" TO "service_role";



GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";



GRANT ALL ON TABLE "public"."ingestion_jobs" TO "anon";
GRANT ALL ON TABLE "public"."ingestion_jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."ingestion_jobs" TO "service_role";



GRANT ALL ON TABLE "public"."initiatives" TO "anon";
GRANT ALL ON TABLE "public"."initiatives" TO "authenticated";
GRANT ALL ON TABLE "public"."initiatives" TO "service_role";



GRANT ALL ON SEQUENCE "public"."initiatives_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."initiatives_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."initiatives_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."initiatives_id_seq" TO "zapier";



GRANT ALL ON SEQUENCE "public"."issues_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."issues_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."issues_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."meeting_segments" TO "anon";
GRANT ALL ON TABLE "public"."meeting_segments" TO "authenticated";
GRANT ALL ON TABLE "public"."meeting_segments" TO "service_role";



GRANT ALL ON TABLE "public"."memories" TO "anon";
GRANT ALL ON TABLE "public"."memories" TO "authenticated";
GRANT ALL ON TABLE "public"."memories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."memories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."memories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."memories_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."memories_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."v_budget_rollup" TO "anon";
GRANT ALL ON TABLE "public"."v_budget_rollup" TO "authenticated";
GRANT ALL ON TABLE "public"."v_budget_rollup" TO "service_role";



GRANT ALL ON TABLE "public"."mv_budget_rollup" TO "anon";
GRANT ALL ON TABLE "public"."mv_budget_rollup" TO "authenticated";
GRANT ALL ON TABLE "public"."mv_budget_rollup" TO "service_role";



GRANT ALL ON TABLE "public"."nods_page" TO "anon";
GRANT ALL ON TABLE "public"."nods_page" TO "authenticated";
GRANT ALL ON TABLE "public"."nods_page" TO "service_role";



GRANT ALL ON SEQUENCE "public"."nods_page_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."nods_page_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."nods_page_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."nods_page_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."nods_page_section" TO "anon";
GRANT ALL ON TABLE "public"."nods_page_section" TO "authenticated";
GRANT ALL ON TABLE "public"."nods_page_section" TO "service_role";



GRANT ALL ON SEQUENCE "public"."nods_page_section_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."nods_page_section_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."nods_page_section_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."nods_page_section_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."notes" TO "anon";
GRANT ALL ON TABLE "public"."notes" TO "authenticated";
GRANT ALL ON TABLE "public"."notes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."open_tasks_view" TO "anon";
GRANT ALL ON TABLE "public"."open_tasks_view" TO "authenticated";
GRANT ALL ON TABLE "public"."open_tasks_view" TO "service_role";



GRANT ALL ON TABLE "public"."opportunities" TO "anon";
GRANT ALL ON TABLE "public"."opportunities" TO "authenticated";
GRANT ALL ON TABLE "public"."opportunities" TO "service_role";



GRANT ALL ON TABLE "public"."optimization_rules" TO "anon";
GRANT ALL ON TABLE "public"."optimization_rules" TO "authenticated";
GRANT ALL ON TABLE "public"."optimization_rules" TO "service_role";



GRANT ALL ON SEQUENCE "public"."optimization_rules_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."optimization_rules_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."optimization_rules_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."optimization_rules_id_seq" TO "zapier";



GRANT ALL ON SEQUENCE "public"."owner_invoice_line_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."owner_invoice_line_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."owner_invoice_line_items_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."owner_invoices_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."owner_invoices_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."owner_invoices_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."parts" TO "anon";
GRANT ALL ON TABLE "public"."parts" TO "authenticated";
GRANT ALL ON TABLE "public"."parts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."payment_transactions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payment_transactions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payment_transactions_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pcco_line_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pcco_line_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pcco_line_items_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pco_line_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pco_line_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pco_line_items_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pending_budget_changes" TO "anon";
GRANT ALL ON TABLE "public"."pending_budget_changes" TO "authenticated";
GRANT ALL ON TABLE "public"."pending_budget_changes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."prime_contract_change_orders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."prime_contract_change_orders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."prime_contract_change_orders_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."prime_contract_sovs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."prime_contract_sovs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."prime_contract_sovs_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."prime_potential_change_orders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."prime_potential_change_orders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."prime_potential_change_orders_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."processing_queue" TO "anon";
GRANT ALL ON TABLE "public"."processing_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."processing_queue" TO "service_role";



GRANT ALL ON TABLE "public"."procore_capture_sessions" TO "anon";
GRANT ALL ON TABLE "public"."procore_capture_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."procore_capture_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."procore_modules" TO "anon";
GRANT ALL ON TABLE "public"."procore_modules" TO "authenticated";
GRANT ALL ON TABLE "public"."procore_modules" TO "service_role";



GRANT ALL ON TABLE "public"."procore_screenshots" TO "anon";
GRANT ALL ON TABLE "public"."procore_screenshots" TO "authenticated";
GRANT ALL ON TABLE "public"."procore_screenshots" TO "service_role";



GRANT ALL ON TABLE "public"."procore_capture_summary" TO "anon";
GRANT ALL ON TABLE "public"."procore_capture_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."procore_capture_summary" TO "service_role";



GRANT ALL ON TABLE "public"."procore_components" TO "anon";
GRANT ALL ON TABLE "public"."procore_components" TO "authenticated";
GRANT ALL ON TABLE "public"."procore_components" TO "service_role";



GRANT ALL ON TABLE "public"."procore_features" TO "anon";
GRANT ALL ON TABLE "public"."procore_features" TO "authenticated";
GRANT ALL ON TABLE "public"."procore_features" TO "service_role";



GRANT ALL ON TABLE "public"."procore_rebuild_estimate" TO "anon";
GRANT ALL ON TABLE "public"."procore_rebuild_estimate" TO "authenticated";
GRANT ALL ON TABLE "public"."procore_rebuild_estimate" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."project" TO "anon";
GRANT ALL ON TABLE "public"."project" TO "authenticated";
GRANT ALL ON TABLE "public"."project" TO "service_role";



GRANT ALL ON TABLE "public"."project_activity_view" TO "anon";
GRANT ALL ON TABLE "public"."project_activity_view" TO "authenticated";
GRANT ALL ON TABLE "public"."project_activity_view" TO "service_role";



GRANT ALL ON TABLE "public"."project_briefings" TO "anon";
GRANT ALL ON TABLE "public"."project_briefings" TO "authenticated";
GRANT ALL ON TABLE "public"."project_briefings" TO "service_role";



GRANT ALL ON TABLE "public"."project_cost_codes" TO "anon";
GRANT ALL ON TABLE "public"."project_cost_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."project_cost_codes" TO "service_role";



GRANT ALL ON TABLE "public"."project_directory" TO "anon";
GRANT ALL ON TABLE "public"."project_directory" TO "authenticated";
GRANT ALL ON TABLE "public"."project_directory" TO "service_role";



GRANT ALL ON TABLE "public"."project_health_dashboard" TO "anon";
GRANT ALL ON TABLE "public"."project_health_dashboard" TO "authenticated";
GRANT ALL ON TABLE "public"."project_health_dashboard" TO "service_role";



GRANT ALL ON TABLE "public"."project_health_dashboard_no_summary" TO "anon";
GRANT ALL ON TABLE "public"."project_health_dashboard_no_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."project_health_dashboard_no_summary" TO "service_role";



GRANT ALL ON SEQUENCE "public"."project_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."project_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."project_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."project_insights" TO "anon";
GRANT ALL ON TABLE "public"."project_insights" TO "authenticated";
GRANT ALL ON TABLE "public"."project_insights" TO "service_role";



GRANT ALL ON TABLE "public"."project_issue_summary" TO "anon";
GRANT ALL ON TABLE "public"."project_issue_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."project_issue_summary" TO "service_role";



GRANT ALL ON TABLE "public"."project_members" TO "anon";
GRANT ALL ON TABLE "public"."project_members" TO "authenticated";
GRANT ALL ON TABLE "public"."project_members" TO "service_role";



GRANT ALL ON TABLE "public"."project_resources" TO "anon";
GRANT ALL ON TABLE "public"."project_resources" TO "authenticated";
GRANT ALL ON TABLE "public"."project_resources" TO "service_role";



GRANT ALL ON SEQUENCE "public"."project_resources_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."project_resources_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."project_resources_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."project_tasks" TO "anon";
GRANT ALL ON TABLE "public"."project_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."project_tasks" TO "service_role";



GRANT ALL ON TABLE "public"."project_users" TO "anon";
GRANT ALL ON TABLE "public"."project_users" TO "authenticated";
GRANT ALL ON TABLE "public"."project_users" TO "service_role";



GRANT ALL ON TABLE "public"."project_with_manager" TO "anon";
GRANT ALL ON TABLE "public"."project_with_manager" TO "authenticated";
GRANT ALL ON TABLE "public"."project_with_manager" TO "service_role";



GRANT ALL ON TABLE "public"."projects_audit" TO "anon";
GRANT ALL ON TABLE "public"."projects_audit" TO "authenticated";
GRANT ALL ON TABLE "public"."projects_audit" TO "service_role";



GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."projects_id_seq" TO "zapier";



GRANT ALL ON TABLE "public"."prospects" TO "anon";
GRANT ALL ON TABLE "public"."prospects" TO "authenticated";
GRANT ALL ON TABLE "public"."prospects" TO "service_role";



GRANT ALL ON SEQUENCE "public"."prospects_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."prospects_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."prospects_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."qto_items" TO "anon";
GRANT ALL ON TABLE "public"."qto_items" TO "authenticated";
GRANT ALL ON TABLE "public"."qto_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."qto_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."qto_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."qto_items_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."qtos" TO "anon";
GRANT ALL ON TABLE "public"."qtos" TO "authenticated";
GRANT ALL ON TABLE "public"."qtos" TO "service_role";



GRANT ALL ON SEQUENCE "public"."qtos_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."qtos_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."qtos_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rag_pipeline_state" TO "anon";
GRANT ALL ON TABLE "public"."rag_pipeline_state" TO "authenticated";
GRANT ALL ON TABLE "public"."rag_pipeline_state" TO "service_role";



GRANT ALL ON TABLE "public"."requests" TO "anon";
GRANT ALL ON TABLE "public"."requests" TO "authenticated";
GRANT ALL ON TABLE "public"."requests" TO "service_role";



GRANT ALL ON TABLE "public"."review_comments" TO "anon";
GRANT ALL ON TABLE "public"."review_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."review_comments" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."rfi_assignees" TO "anon";
GRANT ALL ON TABLE "public"."rfi_assignees" TO "authenticated";
GRANT ALL ON TABLE "public"."rfi_assignees" TO "service_role";



GRANT ALL ON TABLE "public"."rfis" TO "anon";
GRANT ALL ON TABLE "public"."rfis" TO "authenticated";
GRANT ALL ON TABLE "public"."rfis" TO "service_role";



GRANT ALL ON TABLE "public"."risks" TO "anon";
GRANT ALL ON TABLE "public"."risks" TO "authenticated";
GRANT ALL ON TABLE "public"."risks" TO "service_role";



GRANT ALL ON TABLE "public"."schedule_of_values" TO "anon";
GRANT ALL ON TABLE "public"."schedule_of_values" TO "authenticated";
GRANT ALL ON TABLE "public"."schedule_of_values" TO "service_role";



GRANT ALL ON TABLE "public"."schedule_progress_updates" TO "anon";
GRANT ALL ON TABLE "public"."schedule_progress_updates" TO "authenticated";
GRANT ALL ON TABLE "public"."schedule_progress_updates" TO "service_role";



GRANT ALL ON SEQUENCE "public"."schedule_progress_updates_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."schedule_progress_updates_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."schedule_progress_updates_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."schedule_resources" TO "anon";
GRANT ALL ON TABLE "public"."schedule_resources" TO "authenticated";
GRANT ALL ON TABLE "public"."schedule_resources" TO "service_role";



GRANT ALL ON SEQUENCE "public"."schedule_resources_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."schedule_resources_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."schedule_resources_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."schedule_task_dependencies" TO "anon";
GRANT ALL ON TABLE "public"."schedule_task_dependencies" TO "authenticated";
GRANT ALL ON TABLE "public"."schedule_task_dependencies" TO "service_role";



GRANT ALL ON SEQUENCE "public"."schedule_task_dependencies_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."schedule_task_dependencies_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."schedule_task_dependencies_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."schedule_tasks" TO "anon";
GRANT ALL ON TABLE "public"."schedule_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."schedule_tasks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."schedule_tasks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."schedule_tasks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."schedule_tasks_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."sources" TO "anon";
GRANT ALL ON TABLE "public"."sources" TO "authenticated";
GRANT ALL ON TABLE "public"."sources" TO "service_role";



GRANT ALL ON TABLE "public"."sov_line_items" TO "anon";
GRANT ALL ON TABLE "public"."sov_line_items" TO "authenticated";
GRANT ALL ON TABLE "public"."sov_line_items" TO "service_role";



GRANT ALL ON TABLE "public"."sov_line_items_with_percentage" TO "anon";
GRANT ALL ON TABLE "public"."sov_line_items_with_percentage" TO "authenticated";
GRANT ALL ON TABLE "public"."sov_line_items_with_percentage" TO "service_role";



GRANT ALL ON TABLE "public"."specifications" TO "anon";
GRANT ALL ON TABLE "public"."specifications" TO "authenticated";
GRANT ALL ON TABLE "public"."specifications" TO "service_role";



GRANT ALL ON TABLE "public"."sub_jobs" TO "anon";
GRANT ALL ON TABLE "public"."sub_jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."sub_jobs" TO "service_role";



GRANT ALL ON TABLE "public"."subcontractor_contacts" TO "anon";
GRANT ALL ON TABLE "public"."subcontractor_contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."subcontractor_contacts" TO "service_role";



GRANT ALL ON TABLE "public"."subcontractor_documents" TO "anon";
GRANT ALL ON TABLE "public"."subcontractor_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."subcontractor_documents" TO "service_role";



GRANT ALL ON TABLE "public"."subcontractor_projects" TO "anon";
GRANT ALL ON TABLE "public"."subcontractor_projects" TO "authenticated";
GRANT ALL ON TABLE "public"."subcontractor_projects" TO "service_role";



GRANT ALL ON TABLE "public"."subcontractors" TO "anon";
GRANT ALL ON TABLE "public"."subcontractors" TO "authenticated";
GRANT ALL ON TABLE "public"."subcontractors" TO "service_role";



GRANT ALL ON TABLE "public"."subcontractors_summary" TO "anon";
GRANT ALL ON TABLE "public"."subcontractors_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."subcontractors_summary" TO "service_role";



GRANT ALL ON TABLE "public"."submittal_analytics_events" TO "anon";
GRANT ALL ON TABLE "public"."submittal_analytics_events" TO "authenticated";
GRANT ALL ON TABLE "public"."submittal_analytics_events" TO "service_role";



GRANT ALL ON TABLE "public"."submittal_documents" TO "anon";
GRANT ALL ON TABLE "public"."submittal_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."submittal_documents" TO "service_role";



GRANT ALL ON TABLE "public"."submittal_history" TO "anon";
GRANT ALL ON TABLE "public"."submittal_history" TO "authenticated";
GRANT ALL ON TABLE "public"."submittal_history" TO "service_role";



GRANT ALL ON TABLE "public"."submittal_notifications" TO "anon";
GRANT ALL ON TABLE "public"."submittal_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."submittal_notifications" TO "service_role";



GRANT ALL ON TABLE "public"."submittal_performance_metrics" TO "anon";
GRANT ALL ON TABLE "public"."submittal_performance_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."submittal_performance_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."submittals" TO "anon";
GRANT ALL ON TABLE "public"."submittals" TO "authenticated";
GRANT ALL ON TABLE "public"."submittals" TO "service_role";



GRANT ALL ON TABLE "public"."submittal_project_dashboard" TO "anon";
GRANT ALL ON TABLE "public"."submittal_project_dashboard" TO "authenticated";
GRANT ALL ON TABLE "public"."submittal_project_dashboard" TO "service_role";



GRANT ALL ON TABLE "public"."submittal_types" TO "anon";
GRANT ALL ON TABLE "public"."submittal_types" TO "authenticated";
GRANT ALL ON TABLE "public"."submittal_types" TO "service_role";



GRANT ALL ON TABLE "public"."sync_status" TO "anon";
GRANT ALL ON TABLE "public"."sync_status" TO "authenticated";
GRANT ALL ON TABLE "public"."sync_status" TO "service_role";



GRANT ALL ON TABLE "public"."tasks" TO "anon";
GRANT ALL ON TABLE "public"."tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."tasks" TO "service_role";



GRANT ALL ON TABLE "public"."todos" TO "anon";
GRANT ALL ON TABLE "public"."todos" TO "authenticated";
GRANT ALL ON TABLE "public"."todos" TO "service_role";



GRANT ALL ON SEQUENCE "public"."todos_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."todos_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."todos_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."user_projects" TO "anon";
GRANT ALL ON TABLE "public"."user_projects" TO "authenticated";
GRANT ALL ON TABLE "public"."user_projects" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."v_budget_grand_totals" TO "anon";
GRANT ALL ON TABLE "public"."v_budget_grand_totals" TO "authenticated";
GRANT ALL ON TABLE "public"."v_budget_grand_totals" TO "service_role";



GRANT ALL ON TABLE "public"."vertical_markup" TO "anon";
GRANT ALL ON TABLE "public"."vertical_markup" TO "authenticated";
GRANT ALL ON TABLE "public"."vertical_markup" TO "service_role";



GRANT ALL ON TABLE "public"."v_budget_with_markup" TO "anon";
GRANT ALL ON TABLE "public"."v_budget_with_markup" TO "authenticated";
GRANT ALL ON TABLE "public"."v_budget_with_markup" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























