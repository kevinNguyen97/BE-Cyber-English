import 'reflect-metadata';
import mysql from 'mysql';
import DBService from '../config/mysql';
import { singleton } from 'tsyringe';

@singleton()
class VocabularyService {
    private nameSpace = 'VocabularyService'; 
    private connection: mysql.Pool;
    constructor(private dBService: DBService) {
        this.connection = this.dBService.getConnection();
    }
    getListUser() {
        this.connection.query('SELECT * FROM users', (error, result) => {
            console.log(result)
        })
    }


}

export default VocabularyService;