<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->foreignId('sub_section_id')->nullable()->after('section_id')->constrained('sub_sections')->onDelete('cascade');
            // We keep section_id for potential backward compatibility or direct section assignment if needed
            // But ideally we migrate data. For now just adding the column.
            $table->foreignId('section_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['sub_section_id']);
            $table->dropColumn('sub_section_id');
            $table->foreignId('section_id')->nullable(false)->change();
        });
    }
};
