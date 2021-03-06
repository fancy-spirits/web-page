CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "artists" (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" TEXT NOT NULL UNIQUE,
	"picture" bytea NOT NULL,
	"biography" TEXT NOT NULL,
	"user" uuid NOT NULL,
	CONSTRAINT "artists_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "releases" (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" TEXT NOT NULL,
	"release_date" DATE NOT NULL,
	"release_type" TEXT NOT NULL,
	"artwork" bytea NOT NULL,
	"description" TEXT,
	CONSTRAINT "releases_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "release_items" (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" TEXT NOT NULL,
	"genre" uuid NOT NULL,
	"release" uuid NOT NULL,
	"position" smallint NOT NULL,
	CONSTRAINT "release_items_pk" PRIMARY KEY ("id")
) WITH (
	OIDS=FALSE
);



CREATE TABLE "genre" (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "genre_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "release_contribution" (
	"artist" uuid NOT NULL,
	"release" uuid NOT NULL,
	"position" smallint,
	CONSTRAINT "release_contribution_pk" PRIMARY KEY ("artist","release", "position")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "release_item_contribution" (
	"artist" uuid NOT NULL,
	"release_item" uuid NOT NULL,
	"position" smallint,
	CONSTRAINT "release_item_contribution_pk" PRIMARY KEY ("artist","release_item", "position")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "streaming_link" (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"service" TEXT NOT NULL,
	"link" TEXT NOT NULL,
	"release_item" uuid NOT NULL,
	CONSTRAINT "streaming_link_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "streaming_link_release" (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"service" TEXT NOT NULL,
	"link" TEXT NOT NULL,
	"release" uuid NOT NULL,
	CONSTRAINT "streaming_link_release_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "social_link" (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"platform" TEXT NOT NULL,
	"link" TEXT NOT NULL,
	"platform_type" TEXT NOT NULL,
	"artist" uuid NOT NULL,
	CONSTRAINT "social_link_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "users" (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"private_mail" TEXT NOT NULL UNIQUE,
	"pwd_hash" TEXT NOT NULL,
	"salt" TEXT NOT NULL,
	"role" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "artists" ADD CONSTRAINT "artists_fk0" FOREIGN KEY ("user") REFERENCES "users"("id");

ALTER TABLE "release_items" ADD CONSTRAINT "release_items_fk0" FOREIGN KEY ("genre") REFERENCES "genre"("id");
ALTER TABLE "release_items" ADD CONSTRAINT "release_items_fk1" FOREIGN KEY ("release") REFERENCES "releases"("id");

ALTER TABLE "release_contribution" ADD CONSTRAINT "release_contribution_fk0" FOREIGN KEY ("artist") REFERENCES "artists"("id");
ALTER TABLE "release_contribution" ADD CONSTRAINT "release_contribution_fk1" FOREIGN KEY ("release") REFERENCES "releases"("id");

ALTER TABLE "release_item_contribution" ADD CONSTRAINT "release_item_contribution_fk0" FOREIGN KEY ("artist") REFERENCES "artists"("id");
ALTER TABLE "release_item_contribution" ADD CONSTRAINT "release_item_contribution_fk1" FOREIGN KEY ("release_item") REFERENCES "release_items"("id");

ALTER TABLE "streaming_link" ADD CONSTRAINT "streaming_link_fk0" FOREIGN KEY ("release_item") REFERENCES "release_items"("id");
ALTER TABLE "streaming_link_release" ADD CONSTRAINT "streaming_link_release_fk0" FOREIGN KEY ("release") REFERENCES "releases"("id");

ALTER TABLE "social_link" ADD CONSTRAINT "social_link_fk0" FOREIGN KEY ("artist") REFERENCES "artists"("id");

CREATE OR REPLACE FUNCTION artist_social_links(artist_name text)
	RETURNS SETOF social_link
AS
$body$
SELECT * FROM social_link 
WHERE artist IN
	(SELECT id FROM artists WHERE name = $1);
$body$
LANGUAGE SQL;