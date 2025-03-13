import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, default: 'Untitled Book' })
    title: string;

    @Column({ nullable: false })
    author: string;

    @Column({ type: 'float', nullable: false })
    price: number;

    @Column({ type: 'int', nullable: false })
    stock: number;
}
