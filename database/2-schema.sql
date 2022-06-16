CREATE TABLE "artists" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	"picture" bytea NOT NULL,
	"biography" serial NOT NULL,
	"user" uuid NOT NULL,
	CONSTRAINT "artists_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "releases" (
	"id" serial NOT NULL UNIQUE,
	"name" TEXT NOT NULL,
	"release_date" DATE NOT NULL,
	"genre" uuid NOT NULL,
	"release_type" TEXT NOT NULL,
	"artwork" bytea NOT NULL,
	"description" TEXT,
	CONSTRAINT "releases_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "genre" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "genre_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "release_contribution" (
	"artist" uuid NOT NULL,
	"release" uuid NOT NULL,
	CONSTRAINT "release_contribution_pk" PRIMARY KEY ("artist","release")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "streaming_link" (
	"id" serial NOT NULL,
	"service" TEXT NOT NULL,
	"link" TEXT NOT NULL,
	"release" uuid NOT NULL,
	CONSTRAINT "streaming_link_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "social_link" (
	"id" serial NOT NULL,
	"platform" TEXT NOT NULL,
	"link" TEXT NOT NULL,
	"platform_type" TEXT NOT NULL,
	"artist" uuid NOT NULL,
	CONSTRAINT "social_link_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "users" (
	"id" serial NOT NULL UNIQUE,
	"private_mail" TEXT NOT NULL UNIQUE,
	"pwd_hash" TEXT NOT NULL,
	"salt" TEXT NOT NULL,
	"role" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "artists" ADD CONSTRAINT "artists_fk0" FOREIGN KEY ("user") REFERENCES "users"("id");

ALTER TABLE "releases" ADD CONSTRAINT "releases_fk0" FOREIGN KEY ("genre") REFERENCES "genre"("id");


ALTER TABLE "release_contribution" ADD CONSTRAINT "release_contribution_fk0" FOREIGN KEY ("artist") REFERENCES "artists"("id");
ALTER TABLE "release_contribution" ADD CONSTRAINT "release_contribution_fk1" FOREIGN KEY ("release") REFERENCES "releases"("id");

ALTER TABLE "streaming_link" ADD CONSTRAINT "streaming_link_fk0" FOREIGN KEY ("release") REFERENCES "releases"("id");

ALTER TABLE "social_link" ADD CONSTRAINT "social_link_fk0" FOREIGN KEY ("artist") REFERENCES "artists"("id");
