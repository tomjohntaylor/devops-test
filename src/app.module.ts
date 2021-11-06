import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';

const config = require('config');
const dbConfig = config.get('Cats.dbConfig');

console.log("mongodb://"+dbConfig.host+":"+dbConfig.port+"/test");
@Module({
  imports: [
    MongooseModule.forRoot("mongodb://"+dbConfig.host+":"+dbConfig.port+"/test"),
    CatsModule,
  ],
})
export class AppModule {}
