import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Put,
    Query,
    Request,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    CreateClientProfileDto,
    CreateProviderProfileDto,
    ProfilesService,
    UpdateClientProfileDto,
    UpdateProviderProfileDto
} from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('client')
  async createClientProfile(@Request() req, @Body() createProfileDto: CreateClientProfileDto) {
    try {
      return await this.profilesService.createClientProfile(req.user.id, createProfileDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create client profile',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('provider')
  async createProviderProfile(@Request() req, @Body() createProfileDto: CreateProviderProfileDto) {
    try {
      return await this.profilesService.createProviderProfile(req.user.id, createProfileDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create provider profile',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('client/me')
  async getMyClientProfile(@Request() req) {
    try {
      const profile = await this.profilesService.getClientProfile(req.user.id);
      if (!profile) {
        throw new HttpException('Client profile not found', HttpStatus.NOT_FOUND);
      }
      return profile;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch client profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('provider/me')
  async getMyProviderProfile(@Request() req) {
    try {
      const profile = await this.profilesService.getProviderProfile(req.user.id);
      if (!profile) {
        throw new HttpException('Provider profile not found', HttpStatus.NOT_FOUND);
      }
      return profile;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch provider profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('client')
  async updateClientProfile(@Request() req, @Body() updateProfileDto: UpdateClientProfileDto) {
    try {
      return await this.profilesService.updateClientProfile(req.user.id, updateProfileDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update client profile',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('provider')
  async updateProviderProfile(@Request() req, @Body() updateProfileDto: UpdateProviderProfileDto) {
    try {
      return await this.profilesService.updateProviderProfile(req.user.id, updateProfileDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update provider profile',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('providers')
  async getAllProviders(
    @Query('skills') skills?: string,
    @Query('verified') verified?: string,
    @Query('minRate') minRate?: string,
    @Query('maxRate') maxRate?: string,
  ) {
    try {
      const filters = {
        skills,
        verified: verified ? verified === 'true' : undefined,
        minRate: minRate ? parseFloat(minRate) : undefined,
        maxRate: maxRate ? parseFloat(maxRate) : undefined,
      };
      
      return await this.profilesService.getAllProviders(filters);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch providers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}