# 🔒 Setting Up Branch Protection & PR Checks

This guide explains how to **enforce tests and require PR checks before merging** to prevent broken code from being merged.

---

## 🔴 The Problem You Encountered

### Why Your Tests Weren't Blocking Merges

When you pushed code and created a PR:

```
1. You push code from new branch
2. GitHub Actions workflow RUNS (tests execute) ✅
3. Tests pass or fail
4. BUT → You can still merge even if tests fail ❌
```

This happens because **GitHub doesn't automatically prevent merges**. You need to explicitly enable this!

---

## ✅ The Solution: Branch Protection Rules

**Branch Protection Rules** tell GitHub:
- ✅ Run tests on every PR
- ✅ Block merge if tests fail
- ✅ Require someone to review code
- ✅ Prevent direct pushes to main

---

## 🔧 Step-by-Step: Enable Branch Protection

### Step 1: Go to Your Repository Settings

1. Open your GitHub repository
2. Click **Settings** tab (top right)
3. Click **Branches** (left sidebar)

### Step 2: Add Branch Protection Rule

1. Click **Add rule**
2. Enter branch name: `main`
3. Click **Create**

### Step 3: Configure Protection Settings

Enable these checkboxes:

```
✅ Require a pull request before merging
   ├─ ✅ Require approvals (set to 1)
   └─ ✅ Dismiss stale pull request approvals
   
✅ Require status checks to pass before merging
   └─ ✅ Require branches to be up to date before merging
   
✅ Include administrators
```

### Step 4: Select Required Status Checks

After enabling "Require status checks", you'll see a list:

**Select these checks** (they must all pass):
```
✅ test (16.x)
✅ test (18.x)
✅ test (20.x)
✅ code-quality
✅ build
```

### Step 5: Save Settings

Click **Save changes** button

---

## ✅ Workflow After Setup

Once branch protection is enabled:

```
1. You create new branch
            ↓
2. You push code to GitHub
            ↓
3. You create Pull Request
            ↓
4. GitHub automatically runs tests ✅
            ↓
5. Tests execute on Node 16.x, 18.x, 20.x
            ↓
6. If ANY test fails:
   ❌ Merge button DISABLED
   ❌ Shows "Some checks didn't pass"
   ❌ You CANNOT merge until tests pass
            ↓
7. If ALL tests pass:
   ✅ Merge button ENABLED
   ✅ Shows "All checks passed"
   ✅ You CAN merge (if approved)
```

---

## 📊 What You'll See on GitHub

### When Tests Fail (Red X)

```
❌ Some checks didn't pass
   test · 3 required status checks failed
   code-quality · failed
   build · failed

⛔ This branch has 3 failing checks that must pass before merging
```

**Merge button is DISABLED** ❌

### When Tests Pass (Green Checkmark)

```
✅ All checks have passed
   test (16.x) · passed
   test (18.x) · passed
   test (20.x) · passed
   code-quality · passed
   build · passed

✅ All required status checks are passing
```

**Merge button is ENABLED** ✅

---

## 🔄 Step-by-Step: Creating a PR with Enforced Tests

After setting up branch protection:

### Step 1: Create New Branch Locally

```bash
git checkout -b feature/my-feature
```

### Step 2: Make Changes and Test Locally

```bash
# Test your changes locally first
npm test

# If tests fail, fix them before pushing
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Add my feature"
git push origin feature/my-feature
```

### Step 4: Create Pull Request on GitHub

1. Go to your GitHub repository
2. Click **Pull requests** tab
3. Click **New pull request**
4. Select your branch
5. Click **Create pull request**

### Step 5: Watch Tests Run Automatically

GitHub automatically:
- ⚙️ Starts workflow
- 🧪 Runs tests on all 3 Node versions
- 📊 Shows progress in real-time

**You'll see**:
```
Some checks are in progress — 1 pending check

test (16.x) · In progress
test (18.x) · In progress
test (20.x) · In progress
```

### Step 6: View Test Results

Wait for tests to complete:

**If tests pass** ✅
```
✅ All checks have passed

Merge pull request → button is GREEN and ENABLED
```

**If tests fail** ❌
```
❌ Some checks didn't pass

Cannot merge — you must fix the code

1. See which tests failed in the workflow
2. Fix your code
3. Push changes
4. Tests run automatically again
5. When all pass, then merge
```

---

## 🐛 Debugging Failed Tests on PR

When tests fail on GitHub but pass locally:

### Step 1: Check the Error

Click **Details** next to the failed check to see error messages

### Step 2: Understand Common Issues

**Different Node versions**:
```
✅ Passes on 18.x locally
❌ Fails on 16.x on GitHub

Solution: Test locally with multiple versions
npm test
node --version
```

**Environment differences**:
```
❌ Fails on GitHub
✅ Passes locally

Solution: 
rm -rf node_modules package-lock.json
npm install
npm test
```

**Database/file issues**:
```
❌ Fails on fresh checkout
✅ Passes with old data

Solution: Clear server/data/users.json
Delete or create fresh for tests
```

### Step 3: Fix and Push Again

```bash
# Fix your code
# Test locally
npm test

# When local tests pass
git add .
git commit -m "Fix test failures"
git push origin feature/my-feature

# GitHub automatically runs tests again
# Check the PR for updated results
```

---

## 📋 Checklist: Setting Up Branch Protection

```
☐ Go to repository Settings
☐ Click Branches in left sidebar
☐ Click "Add rule"
☐ Enter "main" as branch name
☐ Enable "Require a pull request before merging"
☐ Set "Require approvals" to 1
☐ Enable "Require status checks to pass before merging"
☐ Enable "Require branches to be up to date"
☐ Select all 5 status checks:
  ☐ test (16.x)
  ☐ test (18.x)
  ☐ test (20.x)
  ☐ code-quality
  ☐ build
☐ Enable "Include administrators"
☐ Click "Save changes"
☐ Test by creating a PR with intentional test failure
☐ Verify merge button is disabled
☐ Fix tests and verify merge button becomes enabled
```

---

## 🎯 What Happens at Each Step

### Your Workflow Changes from:

```
Create Branch
    ↓
Push Code
    ↓
Create PR ← Tests run, but YOU decide if merge
    ↓
Merge (even if tests fail) ❌ BAD
    ↓
Broken code in main
```

### To:

```
Create Branch
    ↓
Push Code
    ↓
Create PR
    ↓
GitHub runs tests automatically ✅
    ↓
Tests fail? ❌ Merge BLOCKED
    Fix code → Push again
    ↓
Tests pass? ✅ Merge ALLOWED
    ↓
Merge to main (only with passing tests) ✅
    ↓
Main always has working code
```

---

## 🔐 Additional Branch Protection Options

### Optional but Recommended

```
✅ Require a pull request before merging
✅ Require approvals (set to 1-2 reviewers)
✅ Require status checks to pass
✅ Require branches to be up to date
✅ Restrict who can push to matching branches
✅ Include administrators in restrictions
⚪ Require conversation resolution (optional)
⚪ Require signed commits (advanced)
```

### For Team Projects

If you have a team:
1. Require 2 approvals instead of 1
2. Different rules for different release branches
3. Dismiss stale approvals on new commits

---

## 🚀 Best Practices

### Before Pushing Code

```bash
# Always test locally first
npm test

# Check coverage
npm run test:coverage

# Verify code quality
npm run lint
```

### When Creating PR

1. ✅ Write clear PR title and description
2. ✅ Link related issues
3. ✅ Assign reviewers
4. ✅ Wait for all checks to pass
5. ✅ Request review from teammates

### Before Merging

1. ✅ All tests passing (green checkmarks)
2. ✅ Code reviewed by someone
3. ✅ No merge conflicts
4. ✅ Coverage still good
5. ✅ No security vulnerabilities

---

## ❌ Common Mistakes to Avoid

### ❌ Mistake 1: Allowing Admin to Bypass

```
Don't leave unchecked: "Include administrators"

This lets YOU bypass checks and merge broken code
```

### ❌ Mistake 2: Ignoring Failed Tests

```
Don't dismiss failures and merge anyway

Branch protection prevents this - you MUST fix tests
```

### ❌ Mistake 3: Not Testing Locally First

```
Don't wait for GitHub tests to catch bugs

Test locally first: npm test

Save time and embarrassment
```

### ❌ Mistake 4: Merging Stale Branches

```
Don't merge without main branch updates

Enable: "Require branches to be up to date"

Prevents conflicts and integration issues
```

---

## 🔧 Troubleshooting

### Problem: Can't See Branch Protection Option

**Solution**: 
- Need owner/admin permissions
- Contact repository owner
- Check repo settings access

### Problem: Status Checks Don't Appear in List

**Solution**:
- Workflow hasn't run yet on main
- Make sure tests.yml is in main branch
- Run workflow manually or create dummy PR first

### Problem: Still Can Merge Despite Failed Tests

**Solution**:
- Branch protection might not be saved
- Check if rule is for correct branch
- Refresh page after saving
- Admin might not be included in restrictions

### Problem: Tests Pass Locally but Fail on PR

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Test with exact Node version from workflow
node --version

# Run tests exactly as CI does
npm run test:ci
```

---

## 📚 Additional Resources

### GitHub Documentation
- [About branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)
- [Requiring status checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging)

### Project Documentation
- [QUICKSTART.md](QUICKSTART.md) - Getting started guide
- [TESTING.md](TESTING.md) - Testing guide
- [README.md](README.md) - Project overview

---

## ✅ Verification: Test Your Setup

### Step 1: Create Test PR with Intentional Failure

```bash
git checkout -b test/verify-protection
```

### Step 2: Break a Test Intentionally

Edit `tests/models/validation.test.js`:
```javascript
// Change a passing test to fail
test('should accept valid email addresses', () => {
  expect(isValidEmail('user@example.com')).toBe(false); // FALSE instead of TRUE
});
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Test: Intentionally break test"
git push origin test/verify-protection
```

### Step 4: Create PR on GitHub

Watch the PR and verify:
- ✅ Tests run automatically
- ✅ Tests show failure
- ✅ Merge button is DISABLED
- ✅ Shows "Some checks didn't pass"

### Step 5: Fix and Verify Again

Revert the intentional failure:
```bash
git checkout tests/models/validation.test.js
git commit -am "Fix: Revert test failure"
git push origin test/verify-protection
```

Watch the PR and verify:
- ✅ Tests run automatically again
- ✅ Tests show success
- ✅ Merge button is ENABLED
- ✅ Shows "All checks passed"

### Step 6: Delete Test Branch

```bash
git branch -d test/verify-protection
git push origin --delete test/verify-protection
```

---

## 🎉 Success!

Once branch protection is configured, your workflow is:

```
Secure ✅
├─ All code tested before merge
├─ Failed tests block merge
├─ All branches must have passing tests
└─ Main branch always has working code

Quality ✅
├─ Code reviewed before merge
├─ Tests run on multiple Node versions
├─ Coverage tracked
└─ Security scanned

Automated ✅
├─ Tests run automatically
├─ No manual test running needed
├─ Clear pass/fail feedback
└─ Merge only when ready
```

---

## 📞 Need Help?

If branch protection isn't working:

1. ✅ Check repository **Settings → Branches**
2. ✅ Verify rule is for **main** branch
3. ✅ Verify all 5 checks are selected
4. ✅ Verify status checks are showing in PR
5. ✅ Create test PR and watch it fail intentionally
6. ✅ Check GitHub Actions tab for workflow details

---

**Last Updated**: March 24, 2026  
**Version**: 1.0.0

Now your code is protected! 🔒🚀
