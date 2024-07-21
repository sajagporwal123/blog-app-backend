import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for creating a new blog.
 *
 * Used to validate and document the structure of the data required
 * to create a new blog entry.
 */
export class CreateBlogDto {
  /**
   * The title of the blog.
   *
   * @example 'My First Blog'
   * @description The title of the blog, which must be a non-empty string.
   */
  @ApiProperty({
    description: 'The title of the blog',
    example: 'My First Blog',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  /**
   * The content of the blog.
   *
   * @example 'This is the content of my first blog.'
   * @description The content of the blog, which must be a non-empty string.
   */
  @ApiProperty({
    description: 'The content of the blog',
    example: 'This is the content of my first blog.',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
