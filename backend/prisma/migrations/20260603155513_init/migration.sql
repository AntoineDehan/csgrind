-- CreateEnum
CREATE TYPE "Matchmaking" AS ENUM ('FACEIT', 'PREMIER');

-- CreateEnum
CREATE TYPE "goal_status" AS ENUM ('in_progress', 'completed', 'abandoned');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(50),
    "steam64_id" VARCHAR(17),
    "image" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "matchmaking" "Matchmaking" NOT NULL,
    "elo_goal" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "status" "goal_status" NOT NULL DEFAULT 'in_progress',
    "user_id" TEXT NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aim_rating" DECIMAL(8,4),
    "utility_rating" DECIMAL(8,4),
    "positioning_rating" DECIMAL(8,4),
    "leetify_rating" DECIMAL(8,4),
    "premier_rank" INTEGER,
    "faceit_rank" INTEGER,
    "accuracy_head" DECIMAL(8,4),
    "accuracy_enemy_spotted" DECIMAL(8,4),
    "spray_accuracy" DECIMAL(8,4),
    "counter_strafing_ratio" DECIMAL(8,4),
    "preaim" DECIMAL(8,4),
    "reaction_time_ms" DECIMAL(8,4),
    "flash_hit_per_flash" DECIMAL(8,4),
    "flash_avg_duration" DECIMAL(8,4),
    "flash_leading_to_kill" DECIMAL(8,4),
    "he_foes_damage_avg" DECIMAL(8,4),
    "utility_on_death_avg" DECIMAL(8,4),
    "ct_opening_success" DECIMAL(8,4),
    "t_opening_success" DECIMAL(8,4),
    "trade_kills_success" DECIMAL(8,4),
    "traded_deaths_success" DECIMAL(8,4),
    "winrate" DECIMAL(5,4),
    "total_matches" INTEGER,
    "goal_id" TEXT NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tips" (
    "id" TEXT NOT NULL,
    "category" VARCHAR(30) NOT NULL,
    "priority" SMALLINT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_tips" (
    "report_id" TEXT NOT NULL,
    "tip_id" TEXT NOT NULL,

    CONSTRAINT "report_tips_pkey" PRIMARY KEY ("report_id","tip_id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_trackable" BOOLEAN NOT NULL DEFAULT false,
    "task_stat" VARCHAR(50),
    "track_map" VARCHAR(30),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_tasks" (
    "report_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "track_current" DECIMAL(10,4),
    "track_target" DECIMAL(10,4),

    CONSTRAINT "report_tasks_pkey" PRIMARY KEY ("report_id","task_id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" VARCHAR(500) NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "obtained_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "badge_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_user_id_badge_id_key" ON "user_badges"("user_id", "badge_id");

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_tips" ADD CONSTRAINT "report_tips_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_tips" ADD CONSTRAINT "report_tips_tip_id_fkey" FOREIGN KEY ("tip_id") REFERENCES "tips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_tasks" ADD CONSTRAINT "report_tasks_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_tasks" ADD CONSTRAINT "report_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
