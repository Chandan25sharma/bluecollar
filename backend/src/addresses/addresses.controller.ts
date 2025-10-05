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
    Request,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddressesService, CreateAddressDto, UpdateAddressDto } from './addresses.service';

@Controller('addresses')
export class AddressesController {
  constructor(private addressesService: AddressesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyAddresses(@Request() req) {
    try {
      return await this.addressesService.getClientAddresses(req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch addresses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAddress(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    try {
      return await this.addressesService.createAddress(req.user.id, createAddressDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create address',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateAddress(
    @Param('id') id: string,
    @Request() req,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    try {
      return await this.addressesService.updateAddress(id, req.user.id, updateAddressDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update address',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAddress(@Param('id') id: string, @Request() req) {
    try {
      await this.addressesService.deleteAddress(id, req.user.id);
      return { message: 'Address deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete address',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/set-default')
  async setDefaultAddress(@Param('id') id: string, @Request() req) {
    try {
      return await this.addressesService.setDefaultAddress(id, req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to set default address',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
