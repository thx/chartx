define(
    "chartx/layout/chord",
    [
    
    ],
    function(){
        var range = function(start, stop, step) {
            if (arguments.length < 3) {
              step = 1;
              if (arguments.length < 2) {
                stop = start;
                start = 0;
              }
            }
            if ((stop - start) / step === Infinity) throw new Error("infinite range");
            var range = [],
                 k = range_integerScale(Math.abs(step)),
                 i = -1,
                 j;
            start *= k, stop *= k, step *= k;
            if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k);
            else while ((j = start + step * ++i) < stop) range.push(j / k);
            return range;
        };
        var range_integerScale = function(x) {
            var k = 1;
            while (x * k % 1) k *= 10;
            return k;
        }

        var τ = 2 * Math.PI;

        //layout
        var layout = {};
        layout.chord = function() {
            var chord = {},
                chords,
                groups,
                matrix,
                n,
                padding = 0,
                sortGroups,
                sortSubgroups,
                sortChords;

            function relayout() {
                var subgroups = {},
                    groupSums = [],
                    groupIndex = range(n),
                    subgroupIndex = [],
                    k,
                    x,
                    x0,
                    i,
                    j;

                chords = [];
                groups = [];

                k = 0, i = -1; while (++i < n) {
                    x = 0, j = -1; while (++j < n) {
                        x += matrix[i][j];
                    }
                    groupSums.push(x);
                    subgroupIndex.push(range(n));
                    k += x;
                };

                // Sort groups…
                if (sortGroups) {
                    groupIndex.sort(function(a, b) {
                        return sortGroups(groupSums[a], groupSums[b]);
                    });
                };

                // Sort subgroups…
                if (sortSubgroups) {
                    subgroupIndex.forEach(function(d, i) {
                        d.sort(function(a, b) {
                            return sortSubgroups(matrix[i][a], matrix[i][b]);
                        });
                    });
                };

                k = (τ - padding * n) / k;

                x = 0, i = -1; while (++i < n) {
                    x0 = x, j = -1; while (++j < n) {
                        var di = groupIndex[i],
                            dj = subgroupIndex[di][j],
                            v = matrix[di][dj],
                            a0 = x,
                            a1 = x += v * k;
                        subgroups[di + "-" + dj] = {
                            index: di,
                            subindex: dj,
                            startAngle: a0,
                            endAngle: a1,
                            value: v
                        };
                    }
                    groups[di] = {
                        index: di,
                        startAngle: x0,
                        endAngle: x,
                        value: (x - x0) / k
                    };
                    x += padding;
                };
                i = -1; while (++i < n) {
                    j = i - 1; while (++j < n) {
                        var source = subgroups[i + "-" + j],
                            target = subgroups[j + "-" + i];
                        if (source.value || target.value) {
                            chords.push(source.value < target.value
                                    ? {source: target, target: source}
                                    : {source: source, target: target});
                        }
                    }
                }
                if (sortChords) resort();
            }
            function resort() {
                chords.sort(function(a, b) {
                    return sortChords(
                        (a.source.value + a.target.value) / 2,
                        (b.source.value + b.target.value) / 2);
                });
            }
            chord.matrix = function(x) {
                if (!arguments.length) return matrix;
                n = (matrix = x) && matrix.length;
                chords = groups = null;
                return chord;
            };
            chord.padding = function(x) {
                if (!arguments.length) return padding;
                padding = x;
                chords = groups = null;
                return chord;
            };
            chord.sortGroups = function(x) {
                if (!arguments.length) return sortGroups;
                sortGroups = x;
                chords = groups = null;
                return chord;
            };
            chord.sortSubgroups = function(x) {
                if (!arguments.length) return sortSubgroups;
                sortSubgroups = x;
                chords = null;
                return chord;
            };
            chord.sortChords = function(x) {
                if (!arguments.length) return sortChords;
                sortChords = x;
                if (chords) resort();
                return chord;
            };
            chord.chords = function() {
                if (!chords) relayout();
                return chords;
            };
            chord.groups = function() {
                if (!groups) relayout();
                return groups;
            };
            return chord;
        };
        return layout;
    }
);
