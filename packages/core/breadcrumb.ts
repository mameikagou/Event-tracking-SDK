import type { BreadcrumbTypes } from "@/shared/const"

class Breadcrumb {
	private maxBreadcrumbs = 20

	private breadcrumbStack: BreadcrumbTypes[] = []
}