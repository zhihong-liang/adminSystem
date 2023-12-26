import type { App } from "vue";

import { vPermission } from "./permission";

export default function installDirective(app: App) {
    app.directive('permission', vPermission)
}