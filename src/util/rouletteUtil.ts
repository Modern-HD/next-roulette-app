const color = ['#88C5FA', '#95E2EC', '#FFF9BE', '#FAD6DD', '#D0C6E9', '#FFA477'];

export function sectionColor(location: number) {
    return color[location % color.length];
}
