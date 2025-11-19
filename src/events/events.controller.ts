import { Body, Controller, Delete, Get, Put, Param, Post, Query, ParseIntPipe } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService){}

@Post()
create(@Body() body: any){
    return this.eventsService.create(body);
}
@Get()
findAll(@Query() query: any){
    return this.eventsService.findAll({
        page: Number(query.page)||1,
        limit:Number(query.limit)||10,
        title:query.title,
        location:query.location,
        formDate:query.formDate,
        toDate:query.toDate,
        organizerId: query.organizerId ? Number (query.organizerId): undefined,
    });
}
@Get(':id')
findOne(@Param('id',ParseIntPipe) id:number){
    return this.eventsService.findOne(id);
}
@Put(':id')
update(@Param('id', ParseIntPipe) id: number, @Body() body:any){
    return this.eventsService.update(id, body);
}
@Delete(':id')
remove(@Param('id',ParseIntPipe) id: number){
    return this.eventsService.remove(id);
}
}
