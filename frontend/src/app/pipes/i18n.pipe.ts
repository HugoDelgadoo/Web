import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { IdiomaService } from '../servicios/idioma.service';

@Pipe({
  name: 'i18n',
  standalone: true,
  pure: false
})
export class I18nPipe implements PipeTransform {
  private suscripcion: Subscription;

  constructor(
    private readonly idiomaService: IdiomaService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.suscripcion = this.idiomaService.idiomaActual$.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  transform(clave: string): string {
    return this.idiomaService.traducir(clave);
  }

  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }
}
