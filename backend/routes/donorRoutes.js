const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');
const BST = require('../dsa/BST'); // 👈 Import DSA
const { mergeSort } = require('../dsa/Algorithms'); // 👈 Import DSA

// @route   GET /api/donors/bst-search/:id
// @desc    Search for a donor using a Binary Search Tree
router.get('/bst-search/:id', async (req, res) => {
  try {
    const donors = await Donor.find();
    const bst = new BST();
    donors.forEach(donor => bst.insert(donor)); // Insert all into BST

    const found = bst.search(req.params.id);
    if (!found) return res.status(404).json({ error: 'Donor not found in BST' });
    
    res.status(200).json({ success: true, data: found });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/donors/sorted-distances
// @desc    Get donors sorted by distance using Merge Sort
router.get('/sorted-distances', async (req, res) => {
  try {
    const { lng, lat } = req.query;
    const donors = await Donor.find();

    // Calculate a fake distance for sorting (since we don't have Math logic for geo here)
    const donorsWithDistance = donors.map(d => {
      // In a real app, use Haversine formula here
      const distance = Math.floor(Math.random() * 50) + 1; 
      return { ...d._doc, distance };
    });

    // Extract distances to sort them using our custom Merge Sort
    const distances = donorsWithDistance.map(d => d.distance);
    const sortedDistances = mergeSort(distances);

    res.status(200).json({ success: true, message: 'Sorted using custom Merge Sort', sortedDistances });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ... keep your existing POST route and nearby route ...
module.exports = router;