<template>
	<div class="fixed-bottom">
		<div class="d-flex flex-row-reverse m-3">
			<div class="d-flex flex-row chat-tab">
				<button type="button" class="btn btn-primary position-relative m-2 rounded-circle" data-bs-toggle="offcanvas" data-bs-target="#nveron" aria-expanded="false" aria-controls="nveron">
				N
				</button>
				<div class="offcanvas offcanvas-start" tabindex="-1" id="nveron" aria-labelledby="nveronLabel">
					<div class="offcanvas-header">
						<h5 class="offcanvas-title" id="nveronLabel">Chat with Nveron</h5>
						<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
					</div>
					<div class="offcanvas-body">		
					</div>
				</div>
			</div>
			<div class="d-flex flex-row chat-tab">
				<button type="button" class="btn btn-primary position-relative m-2 rounded-circle" data-bs-toggle="offcanvas" data-bs-target="#oroberts" aria-expanded="false" aria-controls="oroberts">
				O
				</button>
				<div class="offcanvas offcanvas-start" tabindex="-1" id="oroberts" aria-labelledby="orobertsLabel">
					<div class="offcanvas-header">
						<h5 class="offcanvas-title" id="orobertsLabel">Chat with Oroberts</h5>
						<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
					</div>
					<div class="offcanvas-body">		
					</div>
				</div>
			</div>
		</div>
	</div>

</template>
