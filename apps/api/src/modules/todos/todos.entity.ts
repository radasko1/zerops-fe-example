import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  orderBy: {
    id: 'DESC'
  }
})
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  completed: boolean;

  @Column()
  text: string;

  @Column()
  clientId: string;
}
