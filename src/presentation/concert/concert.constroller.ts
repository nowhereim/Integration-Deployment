import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  FindAvailableDateRequestDto,
  FindAvailableSeatsRequestDto,
} from './dto/request.dto';
import { ConcertFacadeApp } from 'src/application/concert/concert.facade';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ActiveQueueAuthGuard } from 'src/presentation/shared/guards/active-auth.guard';
import {
  FindAvailableDateResponseDto,
  FindAvailableSeatsResponseDto,
} from './dto/response.dto';

@ApiTags('Concert')
@Controller('concert')
export class ConcertController {
  constructor(private readonly concertFacadeApp: ConcertFacadeApp) {}

  /* 예약 가능 날짜 조회 */
  @ApiOperation({ summary: '예약 가능 날짜 조회' })
  @UseGuards(ActiveQueueAuthGuard)
  @ApiHeader({
    name: 'queue-token',
    required: true,
    description: '대기열 토큰',
  })
  @ApiResponse({
    status: 200,
    description: '예약 가능 날짜 조회 성공',
  })
  @ApiBadRequestResponse({ description: '잘못된 요청' })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' })
  @ApiForbiddenResponse({ description: '권한 없음' })
  @ApiNotFoundResponse({ description: '예약 가능 일정 없음' })
  @Get('available-dates')
  async getAvailableDates(
    @Query() findAvailableDateRequestDto: FindAvailableDateRequestDto,
  ) {
    return new FindAvailableDateResponseDto(
      await this.concertFacadeApp.findAvailableDate(
        findAvailableDateRequestDto.toDomain(),
      ),
    ).toResponse();
  }

  /* 예약 가능 좌석 조회 */
  @ApiOperation({ summary: '예약 가능 좌석 조회' })
  @UseGuards(ActiveQueueAuthGuard)
  @ApiHeader({
    name: 'queue-token',
    required: true,
    description: '대기열 토큰',
  })
  @ApiResponse({
    status: 200,
    description: '예약 가능 좌석 조회 성공',
  })
  @ApiBadRequestResponse({ description: '잘못된 요청' })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' })
  @ApiForbiddenResponse({ description: '권한 없음' })
  @ApiNotFoundResponse({ description: '예약 가능 좌석 없음' })
  @Get('available-seats')
  async getAvailableSeats(
    @Query() findAvailableSeatsRequestDto: FindAvailableSeatsRequestDto,
  ) {
    return new FindAvailableSeatsResponseDto(
      await this.concertFacadeApp.findAvailableSeats(
        findAvailableSeatsRequestDto.toDomain(),
      ),
    ).toResponse();
  }
}
