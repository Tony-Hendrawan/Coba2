import { Controller, Get, Query, Post, Req, Body, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { SupabaseAuthGuard } from '../auth/supabase.guard';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Get('today')
    async getToday() {
        const data = await this.historyService.getToday();
        return { success: true, data, message: null };
    }

    @Get('search')
    async search(@Query() query: any) {
        const data = await this.historyService.search(query);
        return { success: true, data, message: null };
    }

    @UseGuards(SupabaseAuthGuard)
    @Post('bookmark')
    async bookmark(@Req() req, @Body() body) {
        await this.historyService.bookmark(req.user.id, body.event_id);
        return { success: true, data: {}, message: null };
    }
}
