import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Post from './posts';
import { HttpClient } from "@angular/common/http";

import * as _ from 'underscore';
import { AjaxService } from '../ajax.service'
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  providers: []
})
export class PostsComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef
  posts
  postsLoading;
  pagedPosts = [];
  commentsLoading;
  currentPost;
  users;
  pageSize = 10;
  currentSelectedUser = ""

  constructor(private AjaxService: AjaxService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.postsLoading = true;

    this.loadPosts();

    this.AjaxService.ajaxget('/users')
      .subscribe(datas => this.users = datas)

  }

  getCurrentPostComments(post: Post) {

    this.currentPost = post;
    if (post.comments == undefined) {
      let url = `/posts/${post.id}/comments`
      this.AjaxService.ajaxget(url)
        .subscribe(datas => this.currentPost.comments = datas)
    }
  }

  private loadPosts(filter?) {
    this.postsLoading = true;
    var url = '/posts'

    if (filter && filter.userId) {
      url += "?userId=" + filter.userId;
    }

    this.AjaxService.ajaxget(url)
      .subscribe(datas => {
        this.posts = datas;
        this.pagedPosts = _.take(this.posts, this.pageSize)

      })
  }

  updateFilter(filter) {
    this.currentPost = null;
    this.loadPosts(filter);
  }

  resetFilter() {
    this.currentPost = null;
    this.currentSelectedUser = ""
    this.loadPosts();
  }

  editPost(editForm) {



    let data = {
      id: this.currentPost.id,
      title: editForm.form.value.postTitle,
      body: editForm.form.value.postBody,
      userId: this.currentPost.userId
    }

    this.AjaxService.ajaxput(data, `/posts/${data.id}`)
      .subscribe(res => {

        let index = this.pagedPosts.findIndex(x => x.id == this.currentPost.id)
        this.pagedPosts[index].body = data.body
        this.pagedPosts[index].title = data.title
        this.currentPost.title = data.title
        this.currentPost.body = data.body
        this.closeModal.nativeElement.click()
        editForm.resetForm()
      })
  }

  deletePost() {
    if (confirm("Are you sure you want to delete " + this.currentPost.title + "?")) {
      this.AjaxService.ajaxdelete(`/posts/${this.currentPost.id}`)
        .subscribe(res => {

          let index = this.pagedPosts.findIndex(x => x.id == this.currentPost.id)
          this.pagedPosts.splice(index, 1)
          this.currentPost = null
        })
    }
  }


  onPageChanged(page) {
    var startIndex = (page - 1) * this.pageSize;
    // _.rest offsets the array and then take grabs first n records
    this.pagedPosts = _.take(_.rest(this.posts, startIndex), this.pageSize);
  }


}
