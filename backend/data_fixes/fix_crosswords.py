# -*- coding: utf-8 -*-
"""Krossvord soʻzlarini oʻzaro kesishadigan qilib joylashtiradi."""
import sqlite3, sys, itertools
sys.stdout.reconfigure(encoding='utf-8')
DB = sys.argv[1]
c = sqlite3.connect(DB)


def cells(word, r, col, d):
    return [((r, col + i) if d == 'H' else (r + i, col), ch) for i, ch in enumerate(word)]


def can_place(grid, word, r, col, d):
    cs = cells(word, r, col, d)
    # soʻzdan oldin va keyin boʻsh boʻlishi kerak
    br, bc = (r, col - 1) if d == 'H' else (r - 1, col)
    ar, ac = (r, col + len(word)) if d == 'H' else (r + len(word), col)
    if (br, bc) in grid or (ar, ac) in grid:
        return False
    inter = 0
    for (pos, ch) in cs:
        if pos in grid:
            if grid[pos] != ch:
                return False
            inter += 1
        else:
            pr, pc = pos
            # perpendikulyar qoʻshnilar boʻsh boʻlishi kerak
            nb = [(pr - 1, pc), (pr + 1, pc)] if d == 'H' else [(pr, pc - 1), (pr, pc + 1)]
            if any(n in grid for n in nb):
                return False
    return inter >= 1 or not grid


def try_order(words, order, allow_loose):
    grid, place = {}, {}
    for n, i in enumerate(order):
        w = words[i]
        best = None
        if n == 0:
            best = (0, 0, 'H')
        else:
            cand = []
            for d in 'HV':
                for (pos, ch) in list(grid.items()):
                    for k, wc in enumerate(w):
                        if wc != ch:
                            continue
                        r, col = (pos[0], pos[1] - k) if d == 'H' else (pos[0] - k, pos[1])
                        if can_place(grid, w, r, col, d):
                            inter = sum(1 for (p, _) in cells(w, r, col, d) if p in grid)
                            rs = [p[0] for p in grid] + [x[0][0] for x in cells(w, r, col, d)]
                            cs_ = [p[1] for p in grid] + [x[0][1] for x in cells(w, r, col, d)]
                            area = (max(rs) - min(rs) + 1) * (max(cs_) - min(cs_) + 1)
                            cand.append((-inter, area, r, col, d))
            if cand:
                cand.sort()
                _, _, r, col, d = cand[0]
                best = (r, col, d)
            elif allow_loose:
                best = (max(p[0] for p in grid) + 2, 0, 'H')
        if best is None:
            return None
        r, col, d = best
        for (p, ch) in cells(w, r, col, d):
            grid[p] = ch
        place[i] = best
    return place


def layout(words):
    idx = list(range(len(words)))
    best = None
    for order in itertools.permutations(idx):
        p = try_order(words, order, False)
        if p:
            return p, True
    return try_order(words, sorted(idx, key=lambda i: -len(words[i])), True), False


total = ok = 0
for (cid, title) in c.execute("select id,title from Crossword").fetchall():
    items = c.execute("select id,word from CrosswordItem where crosswordId=? order by rowid", (cid,)).fetchall()
    words = [w for _, w in items]
    p, conn = layout(words)
    total += 1
    if p is None:
        print('FAILED', title, words)
        continue
    minr = min(v[0] for v in p.values())
    minc = min(v[1] for v in p.values())
    for idx, (iid, w) in enumerate(items):
        r, col, d = p[idx]
        c.execute("update CrosswordItem set row=?, col=?, direction=? where id=?",
                  (r - minr, col - minc, 'HORIZONTAL' if d == 'H' else 'VERTICAL', iid))
    ok += 1
    print('OK' if conn else 'LOOSE', title, len(words))
c.commit()
print(ok, '/', total)
