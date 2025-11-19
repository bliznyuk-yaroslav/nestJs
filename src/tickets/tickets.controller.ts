import { Controller , Post, Body, Req, Get, ParseIntPipe, Param, UseGuards,} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthGuard } from 'src/auth/auth.guard';
@UseGuards(AuthGuard)
@Controller('tickets')
export class TicketsController {
    constructor(private ticketsService:TicketsService){}
    @Post('buy')
    buyTicket(@Req() req, @Body() body: {eventId:number; quantity?:number}){
        const userId = req.user.sub;
        return this.ticketsService.buyTicket(userId, body.eventId, body.quantity);
    }
    @Get('my')
    myTickets(@Req() req){
        const userId = req.user.sub;
        return this.ticketsService.myTickets(userId);
    }
    @Get('event/:id')
    eventTickets(@Param('id',ParseIntPipe) id:number){
        return this.ticketsService.eventTickets(id)
}}
