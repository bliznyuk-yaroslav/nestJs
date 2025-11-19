import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { text } from 'stream/consumers';

@Injectable()
export class TicketsService {
    constructor(private prisma: PrismaService){}


    async buyTicket(userId: number, eventId: number, quantity: number=1){
    if(!Number.isInteger(quantity)|| quantity <1){
        throw new BadRequestException('Quantity must be a positive integer');
    }


    return this.prisma.$transaction(async(tx)=> {
        const updated = await tx.event.updateMany({
            where: {id: eventId, available: {gte:quantity}},
            data: {available: {decrement: quantity}},
        });

        if(updated.count ===0){
            const exist = await tx.event.findUnique({ where:{ id: eventId} });
            if(!exist){throw new NotFoundException('Event not found');}
            throw new BadRequestException('Not enough tickets available');
        }
        return tx.ticket.create({
            data:{userId, eventId, quantity}
      });
    });
       
    }


async myTickets(userId:number){
    return this.prisma.ticket.findMany({
        where:{ userId },
        include:{ event:true }
    })
}
async eventTickets(eventId:number){
    return this.prisma.ticket.findMany({
        where: { eventId },
        include:{ user:true}
    })
}
}