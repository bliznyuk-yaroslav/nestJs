import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EventsService {
    constructor( private prisma: PrismaService){}
    create( data: any){
        return this.prisma.event.create({data});
    }
     async findAll(query:{
        page?:number,
        limit?:number,
        title?:string,
        location?:string,
        formDate?:string,
        toDate?:string,
        organizerId?:number
    }){
        const {
            page = 1,
            limit = 10,
            title,
            location,
            formDate,
            toDate,
            organizerId,
        } = query;
        const skip = (page - 1) * limit;
        const where: any = {};
        if(title){
            where.title = {contains: title, mode: 'insensitive'};
        }
        if(location){
            where.location= {contains: location, mode: "insensitive"};
        }
        if(organizerId){
            where.organizerId = Number(organizerId)
        }
        if(formDate || toDate){
            where.date={};
            if(formDate) where.date.gte = new Date(formDate);
            if(toDate)where.date.lte = new Date(toDate);
        }
        const [events, total] = await this.prisma.$transaction([
            this.prisma.event.findMany({
                skip,
                take: limit,
                where,
                orderBy: {date: "desc"}
            }),
            this.prisma.event.count({where})
        ])
        return {
            data: events,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit)
            }
        };
    
    }
    findOne(id: number){
        return this.prisma.event.findUnique({where: {id}});
    }
    update(id: number, data: any){
        return this.prisma.event.update({where: {id},data});
    }
     remove(id:number){
        return this.prisma.event.delete({where: {id}})
     }
}
