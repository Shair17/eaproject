import {Controller, POST, GET, DELETE} from 'fastify-decorators';
import {hasBearerToken, IsAuthenticated} from '../../shared/hooks/auth';
import {Reply, Request} from '../../interfaces/http';
import {PhotoService} from './photo.service';
import {
  GetPhotoParams,
  GetPhotoParamsType,
  CreateCommentBody,
  CreateCommentBodyType,
  DeletePhotoParams,
  DeletePhotoParamsType,
  UploadImageBody,
  UploadImageBodyType,
} from './photo.schema';

@Controller('/photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  // TODO: agregar paginacion
  @GET('/')
  async getPhotos() {
    return this.photoService.getPhotos();
  }

  @GET('/:id', {schema: {params: GetPhotoParams}})
  async getPhoto(request: Request<{Params: GetPhotoParamsType}>, reply: Reply) {
    return this.photoService.getPhoto(request.params);
  }

  @POST('/:id/comment', {
    onRequest: [hasBearerToken, IsAuthenticated],
    schema: {
      body: CreateCommentBody,
    },
  })
  async createComment(
    request: Request<{Body: CreateCommentBodyType}>,
    reply: Reply,
  ) {
    return this.photoService.createComment(request.userId, request.body);
  }

  @POST('/upload', {
    onRequest: [hasBearerToken, IsAuthenticated],
    schema: {
      body: UploadImageBody,
    },
  })
  async uploadPhoto(
    request: Request<{Body: UploadImageBodyType}>,
    reply: Reply,
  ) {
    return this.photoService.uploadPhoto(request.userId, request.body);
  }

  @DELETE('/:id', {
    schema: {params: DeletePhotoParams},
    onRequest: [hasBearerToken, IsAuthenticated],
  })
  async deletePhoto(
    request: Request<{Params: DeletePhotoParamsType}>,
    reply: Reply,
  ) {
    return this.photoService.deletePhoto(request.userId, request.params);
  }
}
