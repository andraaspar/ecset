#include <stdlib.h>
#include <math.h>

extern "C" {

struct path_point {
	double x;
	double y;
};

struct path_segment {
	path_point a;
	path_point b;
};

struct path_color {
	unsigned char r;
	unsigned char g;
	unsigned char b;
	unsigned char a;
};

void path_points_from_coords(double* path_coords, unsigned int coords_length, path_point* points) {
	for (unsigned int i = 0; i < coords_length; i += 2) {
		path_point* pt = &points[i / 2];
		pt->x = path_coords[i];
		pt->y = path_coords[i + 1];
	}
}

unsigned char path_render(unsigned int width, unsigned int length, unsigned char *pixels, double *path_coords, unsigned int coords_length) {
	path_point* points = new path_point[coords_length / 2];

	path_points_from_coords(path_coords, coords_length, points);

	delete[] points;

	return 1;
}

}
