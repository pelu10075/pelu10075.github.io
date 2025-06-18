---
layout: post
title: Vectors and Matrices
date: 2025-06-18 14:00:00
description: What are vectors and matrices, and why do they matter?
tags: LinearAlgebra EN
categories: Study
featured: false
---

## Vectors and Matrices — The Language of Linear Algebra

Now that we've clarified the terminology, it's time to meet the main characters of linear algebra: **vectors** and **matrices**.

They are not just lists or tables of numbers.

They are **tools for representing and transforming data**,

used in **3D graphics, machine learning, physics, statistics**, and many other real-world fields.

---

## What Is a Vector?

A vector is an **ordered list of numbers**.

In linear algebra, we usually write them as **column vectors**, vertically aligned like this:

$$
\vec{v} = \begin{bmatrix} 2 \\ -1 \\ 4 \end{bmatrix}
$$

This is a 3-dimensional vector —

three numbers (2, -1, 4) grouped together as a single entity.

But a vector is more than just a list.

It can represent things like:

- A position in space (a point)
- A direction and magnitude (e.g., force, velocity)
- A bundle of features (e.g., input values in machine learning)

---

### Example of a 2D Vector

$$
\vec{v} = \begin{bmatrix} 3 \\ 4 \end{bmatrix}
$$

This vector points to the location (3, 4) in 2D space.

Its **magnitude (length)** is:

$$
\|\vec{v}\| = \sqrt{3^2 + 4^2} = 5
$$

In other words, it's a **length-5 arrow from the origin to (3, 4)**.

---

## What Is a Matrix?

A matrix is a **rectangular array** of numbers arranged in rows and columns.

Example: a 2×2 matrix

$$
A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}
$$

There are two main ways to understand a matrix:

### 1. A Collection of Vectors

Each **column (or row)** of the matrix can be seen as an individual vector.

So a matrix is like a bundle of multiple vectors.

### 2. A Function That Transforms Vectors

More importantly, a **matrix is a tool that transforms one vector into another**.

This is called a **linear transformation**.

---

### Example: Matrix × Vector

Let’s multiply a matrix and a vector:

$$
A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}, \quad \vec{x} = \begin{bmatrix} 5 \\ 6 \end{bmatrix}
$$

Then:

$$
A\vec{x} =
\begin{bmatrix}
1×5 + 2×6 \\
3×5 + 4×6
\end{bmatrix}
=
\begin{bmatrix}
17 \\
39
\end{bmatrix}
$$

So matrix **A** has transformed vector **x** into a new vector.

---

## Why Vectors and Matrices Matter

These two concepts are the **foundation** of almost every topic in linear algebra:

- Systems of linear equations
- Matrix equations
- Linear transformations
- Eigenvalues and eigenvectors
- Deep learning
- 3D simulation and graphics

To summarize:

**Vectors represent data**, **Matrices represent how we work with that data**.

---

In the next post, we’ll dive deeper into **linear transformations** —
exploring how matrices change vectors using geometric intuition and visual examples.
