import { Component } from '@angular/core';
import { NavbarComponent as BaseComponent } from '../../../../app/navbar/navbar.component';
import { slideMobileNav } from '../../../../app/shared/animations/slide';

import { MenuItemType } from '../../../../app/shared/menu/menu-item-type.model';
import { TextMenuItemModel } from '../../../../app/shared/menu/menu-item/models/text.model';
import { LinkMenuItemModel } from '../../../../app/shared/menu/menu-item/models/link.model';
import { getFirstCompletedRemoteData } from '../../../../app/core/shared/operators';
import { PaginatedList } from '../../../../app/core/data/paginated-list.model';
import { BrowseDefinition } from '../../../../app/core/shared/browse-definition.model';
import { RemoteData } from '../../../../app/core/data/remote-data';
/**
 * Component representing the public navbar
 */
@Component({
  selector: 'ds-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
  animations: [slideMobileNav]
})
export class NavbarComponent extends BaseComponent {
  ngOnInit(): void {
    this.createMenu();
    super.ngOnInit();
  }
  /**
   * Initialize all menu sections and items for this menu
   */
   createMenu() {
    const menuList: any[] = [
      {
        id: `e-learning`,
        active: false,
        visible: true,
        index: 4,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.e-learning',
          link: `/handle/sendafa/47`
        } as LinkMenuItemModel
      },
      {
        id: `laws-and-regulations`,
        active: false,
        visible: true,
        index: 5,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.laws-and-regulations',
          link: `/handle/sendafa/51`
        } as LinkMenuItemModel
      }
    ];
    // Read the different Browse-By types from config and add them to the browse menu
    this.browseService.getBrowseDefinitions()
      .pipe(getFirstCompletedRemoteData<PaginatedList<BrowseDefinition>>())
      .subscribe((browseDefListRD: RemoteData<PaginatedList<BrowseDefinition>>) => {
        if (browseDefListRD.hasSucceeded) {
          browseDefListRD.payload.page.forEach((browseDef: BrowseDefinition) => {
            menuList.push({
              id: `browse_global_by_${browseDef.id}`,
              parentID: 'browse_global',
              active: false,
              visible: true,
              model: {
                type: MenuItemType.LINK,
                text: `menu.section.browse_global_by_${browseDef.id}`,
                link: `/browse/${browseDef.id}`
              } as LinkMenuItemModel
            });
          });
          menuList.push(
            /* Browse */
            {
              id: 'browse_global',
              active: false,
              visible: true,
              index: 1,
              model: {
                type: MenuItemType.TEXT,
                text: 'menu.section.browse_global'
              } as TextMenuItemModel,
            }
          );
        }
        menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, Object.assign(menuSection, {
          shouldPersistOnRouteChange: true
        })));
      });

  }
}
