import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';

/**
 * Data Transfer Object (DTO) for updating a blog.
 *
 * Inherits properties from CreateBlogDto and makes them optional,
 * allowing partial updates to blog entries.
 */
export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
