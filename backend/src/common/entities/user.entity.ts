import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ default: 'user' })
    role: 'admin' | 'user';

    @Column({ type: 'timestamp', nullable: true, default: null })
    last_login: Date | null;

    @Column({ type: 'json', nullable: true, default: null })
    social_login: { social: string; active: number } | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
