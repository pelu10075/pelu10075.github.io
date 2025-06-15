---
layout: post
title: Common Terminology in Linear Algebra
date: 2025-06-15 12:10:00
description: Basic Terminology to Know Before Learning Linear Algebra
tags: LinearAlgebra EN
categories: Study
featured: false
---

## The First Barrier in Linear Algebra: Terminology

When I first started studying linear algebra, the biggest obstacle wasn’t complicated calculations or formulas.

Rather, it was the **terms** like _vector_, _linear independence_, _eigenvalue_, and _null space_ that felt more difficult.

They’re just words, but since I couldn’t grasp their meanings, the formulas didn’t make sense either.

I kept wondering, “Are these math terms? Physics terms? Or just some kind of technical jargon?”

So, before diving into linear algebra seriously,

I decided to organize some **basic terminology** for those like me who get stuck on the language first.

I believe that if you understand the **words** before jumping into the **concepts and formulas**, studying becomes much easier.

---

## Glossary of Linear Algebra Terms

---

### Scalar

A single number. Literally, just a number.

Often appears when multiplying with vectors or matrices.

$$
\ 3,\ -1,\ 0.5,\ \pi
$$

---

### Vector

A list of numbers arranged in a sequence.

In 2D, it can feel like an arrow with direction and magnitude.

$$
\vec{v} = \begin{bmatrix} 2 \\ -1 \end{bmatrix} \quad \text{or} \quad (2,\ -1)


$$

---

### Matrix

A rectangular arrangement of numbers.

Think of it like an Excel spreadsheet, made up of rows and columns.

In later sections, we’ll mostly deal with **vectors in matrix form**.

$$
A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}
$$

Most of the following terms are based on matrices.

---

### Transpose of a Matrix

A matrix with its rows and columns swapped.

$$
A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} \Rightarrow A^T = \begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix}
$$

---

### Identity Matrix

The “1” of matrices.

It has 1s on the main diagonal and 0s elsewhere.

Usually denoted by I.

$$
I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}
$$

---

### Square Matrix

A matrix with the same number of rows and columns.

$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix}, \ \begin{bmatrix} a & b & c \\ d & e & f \\ g & h & i \end{bmatrix} \ ...
$$

---

### Symmetric Matrix

A matrix that stays the same even after transposing.

That is,

$$
A = A^T
$$

---

### Row Echelon Form

A step-by-step matrix form used in Gaussian elimination.

Helpful for solving systems of equations.

$$
\begin{bmatrix} a & b & c \\ 0 & d & e \\ 0 & 0 & 0 \end{bmatrix}
$$

We’ll cover the detailed conditions later in a document about **Gauss-Jordan elimination**.

---

### Zero Matrix

A matrix where all the elements are 0.

$$
\begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}
$$

---

### Diagonal Matrix

Only the main diagonal has values; all other elements are 0.

$$
\begin{bmatrix} 2 & 0 \\ 0 & 5 \end{bmatrix}
$$

---

### Sparse Matrix

A matrix in which most elements are 0.

Common in big data and graph theory applications.

---

### Triangular Matrix

A matrix where one side (upper or lower) is filled with 0s, forming a triangle shape.

Common in Gaussian elimination, LU decomposition, and solving linear systems.

---

### Upper Triangular Matrix

All elements below the main diagonal are 0.

Only the upper part has values.

$$
\begin{bmatrix}
1 & 2 & 3 \\
0 & 4 & 5 \\
0 & 0 & 6
\end{bmatrix}
$$

---

### Lower Triangular Matrix

All elements above the main diagonal are 0.

Only the lower part has values.

$$
\begin{bmatrix}
1 & 0 & 0 \\
2 & 3 & 0 \\
4 & 5 & 6
\end{bmatrix}
$$

---

You don’t need to memorize all the terms above.

If you come across difficult words without explanations, feel free to come back and refer to this guide.
