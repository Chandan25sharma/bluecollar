import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateServiceDto, ServicesService, UpdateServiceDto } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get('nearby')
  async getNearbyServices(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('category') category?: string,
    @Query('maxDistance') maxDistance?: string,
  ) {
    try {
      if (!latitude || !longitude) {
        throw new HttpException(
          'Latitude and longitude are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const max = maxDistance ? parseFloat(maxDistance) : 50; // Default 50km radius

      return await this.servicesService.getNearbyServices(lat, lon, category, max);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch nearby services',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllServices(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
  ) {
    try {
      const filters = {
        category,
        search,
        isActive: isActive ? isActive === 'true' : undefined,
      };
      
      return await this.servicesService.getAllServices(filters);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch services',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    try {
      const service = await this.servicesService.getServiceById(id);
      if (!service) {
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
      }
      return service;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('provider/my-services')
  async getMyServices(@Request() req) {
    try {
      return await this.servicesService.getServicesByProvider(req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch services',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createService(@Request() req, @Body() createServiceDto: CreateServiceDto) {
    try {
      return await this.servicesService.createService(req.user.id, createServiceDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create service',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateService(
    @Param('id') id: string,
    @Request() req,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    try {
      return await this.servicesService.updateService(id, req.user.id, updateServiceDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update service',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteService(@Param('id') id: string, @Request() req) {
    try {
      await this.servicesService.deleteService(id, req.user.id);
      return { message: 'Service deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete service',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/toggle-status')
  async toggleServiceStatus(@Param('id') id: string, @Request() req) {
    try {
      return await this.servicesService.toggleServiceStatus(id, req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to toggle service status',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
