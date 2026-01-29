<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => 'Help Desk',
            'slug' => 'help-desk',
            'description' => 'Get help with our support system',
        ]);

        Product::create([
            'name' => 'Membership Application',
            'slug' => 'membership-application',
            'description' => 'Learn about our membership program',
        ]);
    }
}
