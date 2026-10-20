<?php

namespace Tests\Feature;

use Tests\TestCase;

class QrTest extends TestCase
{
    public function test_qr_apunta_a_la_carta(): void
    {
        $this->get('/qr')
            ->assertStatus(200)
            ->assertSee(url('/'));
    }

    public function test_qr_ignora_url_externa(): void
    {
        $this->get('/qr?url=https://sitio-falso.com')
            ->assertStatus(200)
            ->assertDontSee('sitio-falso.com');
    }
}
