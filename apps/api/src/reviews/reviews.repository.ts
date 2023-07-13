import { EntityRepository, Repository } from 'typeorm';

import { ReviewEntity } from '../entities';

@EntityRepository(ReviewEntity)
export class ReviewsRepository extends Repository<ReviewEntity> {}
